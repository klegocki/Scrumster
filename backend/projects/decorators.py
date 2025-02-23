import json
from functools import wraps
from django.http import JsonResponse
from django.contrib.auth.models import User
from projects.models import Project, Sprint, Task
from django.utils.timezone import now
from django.db.models import Q


def product_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(Q(id=data.get('id')) | Q(id=data.get('project_id')))
            if project.project_owner == request.user:
                return view_func(request, *args, **kwargs)

            if project.product_owner != request.user:
                return JsonResponse({"message": "Użytkownik nie jest product ownerem"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view


def scrum_master(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:

            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(Q(id=data.get('id')) | Q(id=data.get('project_id')))
            if project.project_owner == request.user:
                return view_func(request, *args, **kwargs)

            if project.scrum_master != request.user:
                return JsonResponse({"message": "Użytkownik nie jest scrum masterem"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view


def project_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(Q(id=data.get('id')) | Q(id=data.get('project_id')))
            if project.project_owner != request.user:
                return JsonResponse({"message": "Użytkownik nie jest administratorem projektu"}, status=400)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view

def did_sprint_end(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            if request.method == 'GET':
                data = request.GET

                if not request.user.is_authenticated:
                    return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

                if data.get('sprint_id'):
                    sprint = Sprint.objects.get(id=data.get('sprint_id'))
                elif data.get('task_id'):
                    task = Task.objects.get(id=data.get('task_id'))
                    sprint = task.sprint

                if sprint.end_date < now().date() or sprint.manually_ended:

                    sprints_tasks = Task.objects.filter(
                        Q(sprint=sprint) & (Q(status='Do zrobienia') | Q(status='W trakcie')))

                    for task in sprints_tasks:
                        if task.status == 'Do zrobienia':
                            task.sprint = None
                            task.user = None
                        elif task.status == 'W trakcie':
                            task.status = 'Do zatwierdzenia'
                        task.save()

                return view_func(request, *args, **kwargs)

            elif request.method == 'POST':
                data = json.loads(request.body)

                if not request.user.is_authenticated:
                    return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

                if data.get('sprint_id'):
                    sprint = Sprint.objects.get(id=data.get('sprint_id'))
                elif data.get('task_id'):
                    task = Task.objects.get(id=data.get('task_id'))
                    sprint = task.sprint

                if sprint.end_date < now().date() or sprint.manually_ended:

                    sprints_tasks = Task.objects.filter(
                        Q(sprint=sprint) & (Q(status='Do zrobienia') | Q(status='W trakcie')))

                    for task in sprints_tasks:
                        if task.status == 'Do zrobienia':
                            task.sprint = None
                            task.user = None
                        elif task.status == 'W trakcie':
                            task.status = 'Do zatwierdzenia'
                        task.save()

                    return JsonResponse({"message": "Sprint się już zakończył."}, status=400, safe=False)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view