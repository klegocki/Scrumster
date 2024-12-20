import json
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse
from django.contrib.auth.models import Group, User
from rest_framework import serializers


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1','password2', 'email', 'first_name', 'last_name']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30)
    email = serializers.CharField(max_length=50)
    password1 = serializers.CharField(max_length=30)
    password2 = serializers.CharField(max_length=30)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(max_length=30)

class DeleteProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField()


class LeaveProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField()

class JoinProjectSerializer(serializers.Serializer):
    invite_code = serializers.CharField(max_length=10)





