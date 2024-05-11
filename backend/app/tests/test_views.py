from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from app.models import User
import json

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
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
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
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        new_data = {
            "gender": 1,
            "age": 30
        }
        response = self.client.put("/api/v1/users/", json.dumps(new_data), content_type="application/json")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content.decode("utf-8"))["error"]["message"], "Unauthorized")
        
    