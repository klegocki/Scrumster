from . import views
from django.urls import path


urlpatterns = [
    path('login', views.login_user),
    path('logout', views.logout_user),
    path('register', views.register_user),
    path('loggedInUser', views.get_logged_in_user),
    path('set/username', views.alter_user_username),
    path('set/password', views.alter_user_password),
    path('set/names', views.alter_user_first_and_last_name),
    path('set/email', views.alter_user_email),

]