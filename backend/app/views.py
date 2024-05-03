import bcrypt
import json
import jwt
import os
from jwt.exceptions import InvalidSignatureError
from django.conf import settings
from django.views import View
from django.http import JsonResponse, FileResponse, Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.files.storage import FileSystemStorage
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .models import User, Song
from .utils import yttomp3

'''
Example of using yttomp3 to create a mp3 file in /backend/musics/:
yttomp3("https://www.youtube.com/watch?v=szGomck3sZI")
'''

def authentication(request):
    try:
        # Extract the Authorization header from the request
        auth_header = request.headers.get("Authorization", '')

        # Check if the Authorization header starts with "Bearer "
        if not auth_header.startswith("Bearer "):
            raise InvalidSignatureError("Unauthorized")
        
        # Extract JWT from the Authorization header
        token = auth_header.split(' ')[1]

        # Decode JWT
        user_data = jwt.decode(token, settings.JWT_SECRET_KEY, algorithm="HS256")

        return user_data
    except InvalidSignatureError:
        raise InvalidSignatureError("Unauthorized")


@require_POST
def signup(request):
    try:
        # Define the required data in requests
        required_fields = ['email', 'username', 'password', 'gender', 'realname', 'age', 'phone']

        # Extract user data from the request
        user_data = json.loads(request.body)

        # Check whether there is missing information
        missing_fields = [field for field in required_fields if user_data.get(field, "") == ""]
        if missing_fields:
            return JsonResponse(status=400, data={"error": {"message": f"Missing required fields: {', '.join(missing_fields)}"}})
        
        # Check whether the email already exists
        if User.objects.filter(email=user_data["email"]).exists():
            return JsonResponse(status=400, data={"error": {"message": "Email already exists"}})
        
        # Encrypt the password
        encrypted_password = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())

        # Create the user with the hashed password
        new_user = User.objects.create(
            email=user_data["email"],
            username=user_data["username"],
            password=encrypted_password.decode('utf-8'),
            gender=user_data["gender"],
            realname=user_data["realname"],
            age=user_data["age"],
            phone=user_data["phone"],
        )

        # Create JWT
        token = jwt.encode({
            "ID": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
        }, settings.JWT_SECRET_KEY, algorithm="HS256").decode('utf-8')

        return JsonResponse(status=200, data = {"data": {"access_token": token}})
    except Exception as e:
        return JsonResponse(status=500, data={"error": {"message": "Internal server error"}})
    

@require_POST
def login(request):
    try:
        # Define the required data in requests
        required_fields = ['email', 'password']

        # Extract login data from the request
        login_data = json.loads(request.body)

        # Check whether there is missing information
        missing_fields = [field for field in required_fields if login_data.get(field, "") == ""]
        if missing_fields:
            return JsonResponse(status=400, data={"error": {"message": f"Missing required fields: {', '.join(missing_fields)}"}})
        
        # Check whether the email already signups
        user = User.objects.get(email=login_data["email"])
        
        # Check whether the password is correct
        if bcrypt.hashpw(login_data["password"].encode('utf-8'), user.password.encode('utf-8')) != user.password.encode('utf-8'):
            return JsonResponse(status=401, data={"error": {"message": "Incorrect password"}})
        
        # Create JWT
        token = jwt.encode({
            "ID": user.id,
            "email": user.email,
            "username": user.username,
        }, settings.JWT_SECRET_KEY, algorithm="HS256").decode('utf-8')

        return JsonResponse(status=200, data = {"data": {"access_token": token}})
    except User.DoesNotExist:
            return JsonResponse(status=404, data={"error": {"message": "User not found"}})
    except Exception as e:
        return JsonResponse(status=500, data={"error": {"message": "Internal server error"}})


@method_decorator(csrf_exempt, name='dispatch')
class UserView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Authenticate user
            user_data = authentication(request)
            
            # Retrieve user data from the database
            user = User.objects.get(email=user_data["email"])

            return JsonResponse(status = 200, data = {"data": {
                "email": user.email,
                "username": user.username,
                "realname": user.realname,
                "gender": user.gender,
                "age": user.age,
                "phone": user.phone,
            }})
        except User.DoesNotExist:
            return JsonResponse(status=404, data={"error": {"message": "User not found"}})
        except InvalidSignatureError:
            return JsonResponse(status=401, data={"error": {"message": "Unauthorized"}})
        except Exception as e:
            return JsonResponse(status=500, data={"error": {"message": "Internal server error"}})
    
    def put(self, request, *args, **kwargs):
        try:
            # Authenticate user
            user_data = authentication(request)

            # Extract user data from the request
            new_data = json.loads(request.body)

            # Retrieve user data from the database
            user = User.objects.get(email=user_data["email"])

            # Update user object with new data
            for key, value in new_data.items():
                setattr(user, key, value)

            # Save changes to the database
            user.save()

            return JsonResponse(status = 200, data = {"data": {
                "email": user.email,
                "username": user.username,
                "realname": user.realname,
                "gender": user.gender,
                "age": user.age,
                "phone": user.phone,
            }})
        except User.DoesNotExist:
            return JsonResponse(status=404, data={"error": {"message": "User not found"}})
        except InvalidSignatureError:
            return JsonResponse(status=401, data={"error": {"message": "Unauthorized"}})
        except Exception as e:
            return JsonResponse(status=500, data={"error": {"message": "Internal server error"}})
        
@method_decorator(csrf_exempt, name='dispatch')
class SongView(View):
    def post(self, request, *args, **kwargs):
        # Authenticate user
        user_data = authentication(request)
        # Retrieve user data from the database
        user = User.objects.get(email=user_data["email"])
        model = request.POST.get('model') # user specified voice model
        ytURL = request.POST.get('youtubelink')
        file = request.FILES.get('file') # user uploaded song file

        if ytURL and file:
            return JsonResponse({'error': 'You can only upload a file or provide a YouTube link, not both.'}, status=400)
        if file:
            
            if not file.name.endswith(('.mp3', '.wav')):
                return JsonResponse({'error': 'Invalid file format. Only .mp3 and .wav files are allowed.'}, status=400)
            fs = FileSystemStorage()
            filename = fs.save(file.name, file)
            songname = os.path.splitext(file.name)[0]
            uploaded_file_url = fs.url(filename)
            song = Song(user=user, name=songname, model=model, file=uploaded_file_url)
            song.save()
            return JsonResponse({'data': {'outputfile': uploaded_file_url}}, status=200)
        
        if ytURL:
            file_url, audio_name = yttomp3(ytURL)
            song = Song(user=user, name=audio_name, model=model, file=file_url)
            song.save()
            return JsonResponse({'data': {'outputfile': file_url}}, status=200)
        
        return JsonResponse({'error': 'Please provide a file or a YouTube link.'}, status=400)

    
    def get(self, request, *args, **kwargs):
        # Authenticate the user and get their data
        user_data = authentication(request)
        # Retrieve the user from the database
        user = User.objects.get(email=user_data["email"])

        page = request.GET.get('page', 1) # Default page is 1 if not provided
        num = request.GET.get('num', 10) # Default number of songs per page is 10 if not provided

        # Get all songs for the authenticated user and only the 'id' and 'name' fields
        songs = Song.objects.filter(user=user).order_by('id').values('id', 'name', 'model')
        paginator = Paginator(songs, num)  # Create a Paginator object

        try:
            songs = paginator.page(page)  # Get the songs for the requested page
        except PageNotAnInteger:
            songs = paginator.page(1)  # If page is not an integer, show first page
        except EmptyPage:
            songs = paginator.page(paginator.num_pages)  # If page is out of range, show last page

        # Convert the songs to a list of dictionaries
        song_list = list(songs)

        return JsonResponse(song_list, safe=False, status=200)
    
@method_decorator(csrf_exempt, name='dispatch')
class SongFileView(View):
    def get(self, request, *args, **kwargs):
        # Authenticate the user and get their data
        user_data = authentication(request)
        # Retrieve the user from the database
        user = User.objects.get(email=user_data["email"])
        # Retrieve the song ID from the URL
        song_id = request.GET.get('id')
        try:
            # Retrieve the song from the database
            song = Song.objects.get(user=user, id=song_id)
        except Song.DoesNotExist:
            raise Http404("Song does not exist")

        # Create a FileResponse object with the song file
        # response = FileResponse(open(song.file.path, 'rb'))
        # return response
        # Create a dictionary with the file URL, song name and the model
        return JsonResponse({
            "file": song.file.url,
            "name": song.name,
            "model": song.model
        }, status=200)
    
    def put(self, request, *args, **kwargs): # Change the name of the song file
        # Authenticate the user and get their data
        user_data = authentication(request)
        # Retrieve the user from the database
        user = User.objects.get(email=user_data["email"])
        # Retrieve the song ID from the URL
        song_id = request.GET.get('id')
        # Retrieve the song from the database
        song = Song.objects.get(user=user, id=song_id)
        # Extract the new name from the request
        new_name = json.loads(request.body)["name"]
        # Update the song name
        song.name = new_name
        # Save the changes to the database
        song.save()
        # Return a success response
        return JsonResponse({"message": "Name of the song is changed"}, status=200)

    
    def delete(self, request, *args, **kwargs):
        # Authenticate the user and get their data
        user_data = authentication(request)
        # Retrieve the user from the database
        user = User.objects.get(email=user_data["email"])
        # Retrieve the song ID from the URL
        song_id = request.GET.get('id')
        # Retrieve the song from the database
        song = Song.objects.get(user=user, id=song_id)
        # Delete the song from the database
        song.delete()
        # Return a success response
        return JsonResponse({"message": "This song is deleted"}, status=204)