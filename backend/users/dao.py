from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def handle_login_user(request, data):
    if isinstance(data, User):
        logout(request)
    try:
        check = User.objects.get(username=data["username"].lower())
    except:
        return JsonResponse({"message": "Nieprawidłowa nazwa użytkownika, lub hasło."}, status=400)

    user = authenticate(request, username=data['username'].lower(), password=data['password'])

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
    try:
        user = User.objects.create_user(
            username=data["username"],
            password=data["password1"],
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"]
        )
        user.username = user.username.lower()
        user.save()
        login(request, user)
        return JsonResponse({"message": "Rejestracja użytkownika przeszła pomyślnie."}, status=200)
    except:
        return JsonResponse({"message": "Wystąpił błąd podczas dodawania użytkownika do bazy danych."}, status=400)


def logged_in_user_data_parsing(data):
    parsed_data = {
        "username": data["username"],
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": data["email"]
    }
    return parsed_data