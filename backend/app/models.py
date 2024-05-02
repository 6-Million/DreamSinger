from django.conf import settings
from django.db import models

class User(models.Model):
    email = models.EmailField()
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    gender = models.IntegerField()
    realname = models.CharField(max_length=100)
    age = models.IntegerField()
    phone = models.CharField(max_length=20)

    class Meta:
        db_table = "users"

class Song(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    model = models.IntegerField()
    file = models.FileField(upload_to='songs/')  # uploaded file

    class Meta:
        db_table = "songs"