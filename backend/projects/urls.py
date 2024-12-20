from . import views
from django.urls import path


urlpatterns = [
    path('get', views.get_projects),
    path('delete', views.delete_project),
    path('leave', views.leave_project),
    path('join', views.join_project),
]