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
        # Test signup endpoint
        response = self.client.post("/api/v1/users/signup/", json.dumps(self.user_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", json.loads(response.content.decode("utf-8"))["data"])
        self.token = json.loads(response.content.decode("utf-8"))["data"]["access_token"]

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

