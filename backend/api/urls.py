from . import views
from django.urls import include, path


urlpatterns = [

    path('users/', include('users.urls')),
    path('projects/', include('projects.urls')),

]