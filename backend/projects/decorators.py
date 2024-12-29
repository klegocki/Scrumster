import json
from functools import wraps
from django.http import JsonResponse
from django.contrib.auth.models import User
from projects.models import Project


def product_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(id=data['id'])
            user = User.objects.get(id=request.user.id)
            if project.product_owner != user:
                return JsonResponse({"message": "Użytkownik nie jest product ownerem"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view


def scrum_master(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(id=data['id'])
            user = User.objects.get(id=request.user.id)
            if project.scrum_master != user:
                return JsonResponse({"message": "Użytkownik nie jest scrum masterem"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view


def project_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(id=data['id'])
            user = User.objects.get(id=request.user.id)
            if project.project_owner != user:
                return JsonResponse({"message": "Użytkownik nie jest project ownerem"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view