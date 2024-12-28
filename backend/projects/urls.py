from . import views
from django.urls import path


urlpatterns = [
    path('get', views.get_projects),
    path('delete', views.delete_project),
    path('leave', views.leave_project),
    path('join', views.join_project),
    path('create', views.create_project),
    path('get/project', views.get_project),

]