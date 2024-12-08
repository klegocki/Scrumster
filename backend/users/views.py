
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from api.serializers import CustomUserCreationForm
from django.core.validators import validate_email
from django.core.exceptions import ValidationError



def handle_login_user(request, data):
    if isinstance(data, User):
        logout(request)
    try:
        check = User.objects.get(username=data["username"])
    except:
        return JsonResponse({"message": "Nieprawidłowa nazwa użytkownika, lub hasło."}, status=400)

    user = authenticate(request, username=data['username'], password=data['password'])

    if user is not None:
        login(request, user)
        return JsonResponse("OK.", status=200, safe=False)
    else:
        return JsonResponse({"message": "Nieprawidłowa nazwa użytkownika, lub hasło."}, status=400,)


def handle_register_user(request, data):
    if isinstance(data, User):
        logout(request)

    for value in data.values():
        if ' ' in value:
            return JsonResponse({"message": "Nie można używać spacji."}, status=400)

    if User.objects.filter(username=data['username'].lower()).exists():
        return JsonResponse({"message": "Nazwa użytkownika jest już zajęta."}, status=400)

    if data['password1'] != data['password2']:
        return JsonResponse({"message": "Podane hasła są różne."}, status=400)

    try:
        validate_email(data['email'])
    except ValidationError:
        return JsonResponse({"message": "Podaj poprawny adres email."}, status=400)

    if User.objects.filter(email=data['email']).exists():
        return JsonResponse({"message": "Podany adres email jest już używany."}, status=400)

    form = CustomUserCreationForm(data)
    if form.is_valid():
        user = form.save(commit=False)
        user.username = user.username.lower()
        user.save()
        login(request, user)
        return JsonResponse({"message": "Rejestracja użytkownika przeszła pomyślnie."}, status=200)

    return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
