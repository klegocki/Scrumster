import json
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse
from django.contrib.auth.models import Group, User
from rest_framework import serializers


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1','password2', 'email', 'first_name', 'last_name']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']




def serialize_users_credentials(credentials):
    data = {}

    if isinstance(credentials, str):
        credentials = json.loads(credentials)

    try:
        user = User.objects.get(username=credentials["username"])
    except:
        return JsonResponse({"message": "Nieprawidłowa nazwa użytkownika, lub hasło."}, status=400)

    data["username"] = user.username
    data["password"] = user.password

    return JsonResponse(data, status=200)

