from . import views
import os
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.conf.urls.static import static

API_VERSION_PREFIX = "api/v1/"

urlpatterns = [
    path(API_VERSION_PREFIX + 'users/signup/', csrf_exempt(views.signup)),
    path(API_VERSION_PREFIX + 'users/login/', csrf_exempt(views.login)),
    path(API_VERSION_PREFIX + 'users/', views.UserView.as_view()),
    path(API_VERSION_PREFIX + 'songs/', views.SongView.as_view()),
    path(API_VERSION_PREFIX + 'songs/file/', views.SongFileView.as_view()),
    path(API_VERSION_PREFIX + 'download/<str:file_folder>/<str:file_name>/', views.download_song),
]
urlpatterns += static('cover/', document_root=os.path.join(settings.BASE_DIR, 'cover/'))
urlpatterns += static('media/', document_root=os.path.join(settings.BASE_DIR, 'media/'))
