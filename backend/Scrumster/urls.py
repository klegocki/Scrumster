from django.urls import include, path
from . import views


urlpatterns = [

    path('loginUser', views.login_user),
    path('logoutUser', views.logout_user),

]