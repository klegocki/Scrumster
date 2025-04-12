from . import views
from django.urls import path


urlpatterns = [
    path('users/get', views.get_users_tasks),
    path('completed/get',views.get_project_completed_tasks),
    path('delete', views.delete_task),
    path('create', views.create_task),
    path('sprint/delete', views.delete_task_from_sprint),
    path('set/user', views.assign_developer_task),
    path('completion', views.sprint_task_completion),
    path('approval', views.approve_task),
    path('rejection', views.reject_task),
    path('revert', views.sprint_backlog_task_user_revert),
    path('search/users/tasks', views.search_users_tasks),
    path('sprint/add', views.add_tasks_to_existing_sprint),
]