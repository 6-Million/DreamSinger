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