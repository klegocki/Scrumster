from . import views
from django.urls import path


urlpatterns = [
    path('get', views.get_projects),
    path('delete', views.delete_project),
    path('leave', views.leave_project),
    path('join', views.join_project),
    path('create', views.create_project),
    path('get/project', views.get_project),
    path('get/backlog', views.get_project_backlog),
    path('get/sprints', views.get_project_sprints),
    path('task/delete', views.delete_task),
    path('sprint/delete', views.delete_sprint),
    path('task/create', views.create_task),
    path('sprint/create', views.create_sprint),

]