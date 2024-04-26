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

## API Docs
### 1. `POST /api/v1/users/signup/`
#### Request
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
#### Response
200
```
{
    "data": 
        {
            "access_token": <ACCESS_TOKEN>
        }
}
```
400
```
{
    "error": 
        {
            "message": "Email already exists"
        }
}
```
400
```
{
    "error": 
        {
            "message": "Missing required fields: email, password"
        }
}
```
500
```
{
    "error": 
        {
            "message": "Internal server error"
        }
}
```

### 2. `POST /api/v1/users/login/`
#### Request
```
{
    "email": "example@umass.edu",
    "password": "12345",
}
```
#### Response
200
```
{
    "data": 
        {
            "access_token": <ACCESS_TOKEN>
        }
}
```
400
```
{
    "error": 
        {
            "message": "Email already exists"
        }
}
```
401
```
{
    "error": 
        {
            "message": "Incorrect password"
        }
}
```
404
```
{
    "error": 
        {
            "message": "User not found"
        }
}
```
500
```
{
    "error": 
        {
            "message": "Internal server error"
        }
}
```

### 3. `GET /api/v1/users/`
#### Request
Header
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```
#### Response
200
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
401
```
{
    "error": 
        {
            "message": "Unauthorized"
        }
}
```
404
```
{
    "error": 
        {
            "message": "User not found"
        }
}
```
500
```
{
    "error": 
        {
            "message": "Internal server error"
        }
}
```

### 4. `PUT /api/v1/users/`
#### Request
Header
```
{
    "Authorization": "Bearer <ACCESS_TOKEN>"
}
```
Body
```
{
    "gender": 1,
    "age": 20,
}
```
#### Response
200
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
401
```
{
    "error": 
        {
            "message": "Unauthorized"
        }
}
```
404
```
{
    "error": 
        {
            "message": "User not found"
        }
}
```
500
```
{
    "error": 
        {
            "message": "Internal server error"
        }
}
```