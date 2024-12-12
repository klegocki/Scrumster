from http.client import HTTPResponse
from django.contrib.auth import logout
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from django.http import JsonResponse
from rest_framework.decorators import api_view
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from api.serializers import UserRegistrationSerializer, UserLoginSerializer
from users.views import handle_register_user, handle_login_user




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]