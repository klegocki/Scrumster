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
        return JsonResponse({"message": "Nazwa użytkownika jest już używana."}, status=400)

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

def handle_alter_user_first_last_name(request, data):

    logged_user = User.objects.get(id=request.user.id)

    if data['first_name'].strip() == "" and data["last_name"].strip() == "":
        return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)


    for value in data.values():
        if ' ' in value:
            return JsonResponse({"message": "Nie można używać spacji."}, status=400)


    try:
        if not data['first_name'] == "":
            logged_user.first_name = data["first_name"]
        if not data["last_name"] == "":
            logged_user.last_name = data["last_name"]

        logged_user.save()
        logout(request)
        login(request, logged_user)

        return JsonResponse({"message": "Pomyślnie zmieniono imię i/lub nazwisko."}, status=200)
    except:
        return JsonResponse({"message": "Wystąpił błąd podczas modyfikacji danych użytkownika."}, status=400)

def handle_alter_user_email(request, data):

    if data['email'].trim() == "":
        return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)


    logged_user = User.objects.get(id=request.user.id)

    for value in data.values():
        if ' ' in value:
            return JsonResponse({"message": "Nie można używać spacji."}, status=400)

    try:
        validate_email(data['email'])
    except ValidationError:
        return JsonResponse({"message": "Podaj poprawny adres email."}, status=400)

    if User.objects.filter(email=data['email']).exists():
        return JsonResponse({"message": "Podany adres email jest już używany."}, status=400)

    try:

        logged_user.email = data["email"]
        logged_user.save()
        logout(request)
        login(request, logged_user)

        return JsonResponse({"message": "Pomyślnie zmieniono adres email."}, status=200)
    except:
        return JsonResponse({"message": "Wystąpił błąd podczas modyfikacji danych użytkownika."}, status=400)


def handle_alter_user_username(request, data):

    logged_user = User.objects.get(id=request.user.id)

    if data['username'].trim() == "":
        return JsonResponse({"message": "Proszę wypełnić pole."}, status=400)

    for value in data.values():
        if ' ' in value:
            return JsonResponse({"message": "Nie można używać spacji."}, status=400)

    if User.objects.filter(username=data['username'].lower()).exists():
        return JsonResponse({"message": "Nazwa użytkownika jest już zajęta."}, status=400)

    try:

        logged_user.username = data["username"]
        logged_user.save()
        logout(request)
        login(request, logged_user)

        return JsonResponse({"message": "Pomyślnie zmieniono nazwę użytkownika."}, status=200)
    except:
        return JsonResponse({"message": "Wystąpił błąd podczas modyfikacji danych użytkownika."}, status=400)


def handle_alter_user_password(request, data):

    logged_user = User.objects.get(id=request.user.id)

    for value in data.values():
        if ' ' in value:
            return JsonResponse({"message": "Nie można używać spacji."}, status=400)

    if data['password1'] and data['password2'] and data['password1'] != data['password2']:
        return JsonResponse({"message": "Podane hasła są różne."}, status=400)

    try:

        logged_user.set_password(data['password1'])
        logged_user.save()
        logout(request)
        login(request, logged_user)

        return JsonResponse({"message": "Pomyślnie zmieniono hasło."}, status=200)
    except:
        return JsonResponse({"message": "Wystąpił błąd podczas modyfikacji danych użytkownika."}, status=400)
