import json

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from users.dao import handle_login_user, handle_register_user, logged_in_user_data_parsing


@api_view(['POST'])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_login_user(request, serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "Wylogowano pomyślnie."}, status=200)
    return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)

@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_register_user(request, serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['GET'])
def get_logged_in_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = logged_in_user_data_parsing(serializer.data)
        return JsonResponse(response, status=200)
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)

