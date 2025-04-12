from django.urls import include, path


urlpatterns = [

    path('users/', include('users.urls')),
    path('projects/', include('projects.urls')),
    path('tasks/', include('tasks.urls')),
    path('sprints/', include('sprints.urls')),

]