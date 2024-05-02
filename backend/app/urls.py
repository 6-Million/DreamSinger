from . import views
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

API_VERSION_PREFIX = "api/v1/"

urlpatterns = [
    path(API_VERSION_PREFIX + 'users/signup/', csrf_exempt(views.signup)),
    path(API_VERSION_PREFIX + 'users/login/', csrf_exempt(views.login)),
    path(API_VERSION_PREFIX + 'users/', views.UserView.as_view()),
    path(API_VERSION_PREFIX + 'songs/', views.SongView.as_view()),
]
