from . import views
from django.urls import path


urlpatterns = [
    path('get', views.get_project_sprints),
    path('delete', views.delete_sprint),
    path('create', views.create_sprint),
    path('backlog/get', views.get_sprints_backlog),
    path('sprint/info/get', views.get_sprint_info),
    path('review/set', views.add_sprint_review),
    path('end', views.end_sprint),
]