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
    path('get/completed/tasks',views.get_project_completed_tasks),
    path('get/sprints', views.get_project_sprints),
    path('task/delete', views.delete_task),
    path('sprint/delete', views.delete_sprint),
    path('task/create', views.create_task),
    path('sprint/create', views.create_sprint),
    path('get/sprint/backlog', views.get_sprints_backlog),
    path('sprint/task/delete', views.delete_task_from_sprint),
    path('sprint/get', views.get_sprint_info),
    path('sprint/task/set/user', views.assign_developer_task),
    path('sprint/task/completion', views.sprint_task_completion),
    path('sprint/task/revert', views.sprint_backlog_task_user_revert),
    path('sprint/review/set', views.add_sprint_review),
    path('sprint/end', views.end_sprint),
    path('set/role', views.set_user_project_role),
    path('delete/role', views.delete_user_project_role),

]