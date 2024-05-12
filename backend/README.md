# Backend

## How to Run
Run the backend server at port `8000` with the following commands:
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations && python manage.py migrate
python manage.py runserver
```

## Testing
Use the following command to run the unit tests:
```
cd backend
python manage.py test
```

## API Docs
There are 9 main APIs in the backend server:
1. [POST /api/v1/users/signup/](#1-post-apiv1userssignup)
2. [POST /api/v1/users/login/](#2-post-apiv1userslogin)
3. [GET /api/v1/users/](#3-get-apiv1users)
4. [PUT /api/v1/users/](#4-put-apiv1users)
5. [POST /api/v1/songs/](#5-post-apiv1songs)
6. [GET /api/v1/songs?page=[page]&num=[number-per-page]](#6-get-apiv1songspagenumber-and-numnumber-per-page)
7. [GET /api/v1/songs/file/{id}/](#7-get-apiv1songsfileid)
8. [PUT /api/v1/songs/file/{id}/](#8-put-apiv1songsfileid)
9. [DELETE /api/v1/songs/file/{id}/](#9-delete-apiv1songsfileid)


### 1. `POST /api/v1/users/signup/`

#### Request Body Example:
```
{
    "email": "example@umass.edu",
    "username": "example",
    "password": "12345",
    "gender": 0,
    "realname": "example",
    "age": 30,
    "phone": "example"
}
```

#### Response:
- Status Code: 200
    ```
    {
        "data": {
            "access_token": <ACCESS_TOKEN>
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Email already exists"
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Missing required fields: email, password"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 2. `POST /api/v1/users/login/`

#### Request Body Example:
```
{
    "email": "example@umass.edu",
    "password": "12345",
}
```

#### Response:
- Status Code: 200
    ```
    {
        "data": {
            "access_token": <ACCESS_TOKEN>
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Missing required fields: email"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Incorrect password"
        }
    }
    ```
- Status Code: 404
    ```
    {
        "error": {
            "message": "User not found"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 3. `GET /api/v1/users/`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Response:
- Status Code: 200
    ```
    {
        "data": {
            "email": "example@umass.edu",
            "username": "example",
            "realname": "example",
            "gender": 0,
            "age": 30,
            "phone": "example"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 404
    ```
    {
        "error": {
            "message": "User not found"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 4. `PUT /api/v1/users/`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Request Body Example:
```
{
    "gender": 1,
    "age": 20,
}
```

#### Response:
- Status Code: 200
    ```
    {
        "data": {
            "email": "example@umass.edu",
            "username": "example",
            "realname": "example",
            "gender": 1,
            "age": 20,
            "phone": "example"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 404
    ```
    {
        "error": {
            "message": "User not found"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 5. `POST /api/v1/songs/`

#### Request Header:
```
{
	"Authorization": "Bearer <ACCESS_TOKEN>"
    "Content-Type": "multipart/form-data"
}
```

#### Request Body:
If the user chooses to upload the YouTube link for the song:
```
{
    "model": int,
    "youtubelink": "string"
}
```
If the user chooses to upload the file of the song directly:
```
{
    "model": int,
    "file": file
}
```

#### Response:
- Status Code: 200 
    ```
    {
        "data": {
            "outputfile": “String” // path to the file
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "You can only upload a file or provide a YouTube link, not both."
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Invalid file format. Only .mp3 and .wav files are allowed."
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Please provide a file or a YouTube link."
        }
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "YouTube link unavailable"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 6. `GET /api/v1/songs?page=[page]&num=[number per page]`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Response:
- Status Code: 200
    ```
    [   
        {
            "id": int,
            "name": String,
            "model": int,
            "file": String // path to file
        }, ...
    ]
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 7. `GET /api/v1/songs/file/{id}/`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Response:
- Status Code: 200 
    ```
    {
        "name": String,
        "model": int,
        "file": String // path to file
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Song does not exist"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 8. `PUT /api/v1/songs/file/{id}/`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Request Body:
```
{
	"name": String
}
```

#### Response:
- Status Code: 200
    ```
    {
        "message": "Name of the song is changed"
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Song does not exist"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```

### 9. `DELETE /api/v1/songs/file/{id}/`

#### Request Header:
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

#### Response:
- Status Code: 200
    ```
    {
        "message": "This song is deleted"
    }
    ```
- Status Code: 400
    ```
    {
        "error": {
            "message": "Song does not exist"
        }
    }
    ```
- Status Code: 401
    ```
    {
        "error": {
            "message": "Unauthorized"
        }
    }
    ```
- Status Code: 500
    ```
    {
        "error": {
            "message": "Internal server error"
        }
    }
    ```