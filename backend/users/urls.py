from . import views
from django.urls import path


urlpatterns = [
    path('login', views.login_user),
    path('logout', views.logout_user),
    path('register', views.register_user),
    path('loggedInUser', views.get_logged_in_user),
]