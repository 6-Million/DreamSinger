from django.test import TestCase, Client
from app.models import User, Song
import json
import os
from django.core.files.uploadedfile import SimpleUploadedFile

class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_data = {
            "email": "test@example.com",
            "username": "test_user",
            "password": "testpassword",
            "gender": 0,
            "realname": "Test User",
            "age": 25,
            "phone": "1234567890"
        }
    
    def test_signup_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", json.loads(response.content.decode("utf-8"))["data"])

    def test_signup_email_exists(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Email already exists")

    def test_signup_missing_required_fields(self):
        user_data_incomplete = self.user_data.copy()
        user_data_incomplete.pop("email", None)
        user_data_incomplete.pop("username", None)
        
        response = self.client.post("/api/v1/users/signup/", json.dumps(user_data_incomplete), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertTrue(json.loads(response.content.decode("utf-8"))["error"]["message"].startswith("Missing required fields: "))

    def test_login_success(self):
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }

        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        response = self.client.post("/api/v1/users/login/", json.dumps(login_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", json.loads(response.content.decode("utf-8"))["data"])
    
    def test_login_missing_required_fields(self):
        login_data = {
            "email": self.user_data["email"],
        }

        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        response = self.client.post("/api/v1/users/login/", json.dumps(login_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertTrue(json.loads(response.content.decode("utf-8"))["error"]["message"].startswith("Missing required fields: "))

    def test_login_incorrect_password(self):
        login_data = {
            "email": self.user_data["email"],
            "password": "error"
        }

        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        response = self.client.post("/api/v1/users/login/", json.dumps(login_data), content_type="application/json")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Incorrect password")
    
    def test_login_nonexistent_user(self):
        login_data = {
            "email": "error",
            "password": self.user_data["password"]
        }

        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        response = self.client.post("/api/v1/users/login/", json.dumps(login_data), content_type="application/json")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "User not found")

    def test_get_user_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.client.get("/api/v1/users/", headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["data"], {
            "email": self.user_data["email"],
            "username": self.user_data["username"],
            "realname": self.user_data["realname"],
            "gender": self.user_data["gender"],
            "age": self.user_data["age"],
            "phone": self.user_data["phone"]
        })

    def test_get_user_unauthorized(self):
        response = self.client.get("/api/v1/users/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
    
    def test_put_user_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        new_data = {
            "gender": 1,
            "age": 30
        }
        response = self.client.put("/api/v1/users/", json.dumps(new_data), content_type="application/json", headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["data"], {
            "email": self.user_data["email"],
            "username": self.user_data["username"],
            "realname": self.user_data["realname"],
            "gender": new_data["gender"],
            "age": new_data["age"],
            "phone": self.user_data["phone"]
        })

    def test_put_user_unauthorized(self):
        new_data = {
            "gender": 1,
            "age": 30
        }
        response = self.client.put("/api/v1/users/", json.dumps(new_data), content_type="application/json")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
        
    def test_post_song_with_file_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        file = SimpleUploadedFile('test_song.mp3', content=b'Simulated MP3 file content', content_type='audio/mpeg')
        song_data = {
            'model': 1,
            'file': file,
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers, format='multipart')
        self.assertEqual(response.status_code, 200)
        self.assertIn("outputfile", json.loads(response.content.decode("utf-8"))["data"])
        os.remove("media/test_song.mp3")
    
    def test_post_song_with_file_invalid_format(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        file = SimpleUploadedFile('test_song.txt', content=b'Simulated MP3 file content', content_type='audio/mpeg')
        song_data = {
            'model': 1,
            'file': file,
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Invalid file format. Only .mp3 and .wav files are allowed.")

    def test_post_song_with_yt_link_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        song_data = {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZI',
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("outputfile", json.loads(response.content.decode("utf-8"))["data"])
        os.remove("media/Love Me Harder (Official Lyric Video).mp3")
    
    def test_post_song_with_invalid_yt_link(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        song_data = {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZ1',
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "YouTube link unavailable")
    
    def test_post_song_with_two_methods(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        file = SimpleUploadedFile('test_song.mp3', content=b'Simulated MP3 file content', content_type='audio/mpeg')
        song_data = {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZ1',
            'file': file,
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "You can only upload a file or provide a YouTube link, not both.")
    
    def test_post_song_without_any_method(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        song_data = {
            'model': 1,
        }

        response = self.client.post("/api/v1/songs/", song_data, headers=headers)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Please provide a file or a YouTube link.")
    
    def test_post_song_unauthorized(self):
        song_data = {
            'model': 1,
        }
        response = self.client.post("/api/v1/songs/", song_data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")

    def test_get_songs_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        songs_data = [{
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZI',
        }, {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=60ItHLz5WEA',
        }, {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=n8X9_MgEdCg',
        }]
        for i in range(3):
            response = self.client.post("/api/v1/songs/", songs_data[i], headers=headers)
        os.remove("media/Love Me Harder (Official Lyric Video).mp3")
        os.remove("media/Alan Walker - Faded.mp3")
        os.remove("media/Unity.mp3")

        response = self.client.get('/api/v1/songs/', {'page': 1, 'num': 10}, headers=headers)
        songs = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(songs), 3)

        response = self.client.get('/api/v1/songs/', {'page': 1, 'num': 2}, headers=headers)
        songs = json.loads(response.content.decode("utf-8"))
        self.assertLess(len(songs), 3)

    def test_get_songs_unauthorized(self):
        response = self.client.get('/api/v1/songs/', {'page': 1, 'num': 10})

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
    
    def test_get_song_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        song_data = {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZI',
        }
        response = self.client.post("/api/v1/songs/", song_data, headers=headers)
        os.remove("media/Love Me Harder (Official Lyric Video).mp3")

        response = self.client.get('/api/v1/songs/file/', {'id': 1}, headers=headers)
        song = json.loads(response.content.decode("utf-8"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("file", song)
        self.assertIn("name", song)
        self.assertIn("model", song)

    def test_get_song_nonexistent(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.client.get('/api/v1/songs/file/', {'id': 1}, headers=headers)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Song does not exist")
        
    def test_get_song_unauthorized(self):
        response = self.client.get('/api/v1/songs/file/', {'id': 1})

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
    
    def test_put_song_success(self):
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        access_token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]
        headers = {'Authorization': f'Bearer {access_token}'}
        song_data = {
            'model': 1,
            'youtubelink': 'https://www.youtube.com/watch?v=szGomck3sZI',
        }
        response = self.client.post("/api/v1/songs/", song_data, headers=headers)
        os.remove("media/Love Me Harder (Official Lyric Video).mp3")

        new_data = {
            "name": "new_song_name"
        }
        response = self.client.put('/api/v1/songs/file/?id=1', json.dumps(new_data), headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["message"], "Name of the song is changed")

        response = self.client.get('/api/v1/songs/file/', {'id': 1}, headers=headers)
        song = json.loads(response.content.decode("utf-8"))
        self.assertEqual(song["name"], new_data["name"])

    def test_put_song_unauthorized(self):
        new_data = {
            "name": "new_song_name"
        }
        response = self.client.put('/api/v1/songs/file/?id=1', json.dumps(new_data))

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
