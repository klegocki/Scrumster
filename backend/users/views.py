import json

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, \
    UserAlterPasswordSerializer, UserAlterEmailSerializer, UserAlterFirstAndLastNameSerializer, \
    UserAlterUsernameSerializer
from users.dao import handle_login_user, handle_register_user, logged_in_user_data_parsing, handle_alter_user_password, \
    handle_alter_user_email, handle_alter_user_first_last_name, handle_alter_user_username


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


@api_view(['POST'])
def alter_user_password(request):
    if request.user.is_authenticated:
        serializer = UserAlterPasswordSerializer(data=request.data)
        if serializer.is_valid():
            response = handle_alter_user_password(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@api_view(['POST'])
def alter_user_email(request):
    if request.user.is_authenticated:
        serializer = UserAlterEmailSerializer(data=request.data)
        if serializer.is_valid():
            response = handle_alter_user_email(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@api_view(['POST'])
def alter_user_first_and_last_name(request):
    if request.user.is_authenticated:
        serializer = UserAlterFirstAndLastNameSerializer(data=request.data)
        if serializer.is_valid():
            response = handle_alter_user_first_last_name(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@api_view(['POST'])
def alter_user_username(request):
    if request.user.is_authenticated:
        serializer = UserAlterUsernameSerializer(data=request.data)
        if serializer.is_valid():
            response = handle_alter_user_username(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Proszę wypełnić pole.."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)
