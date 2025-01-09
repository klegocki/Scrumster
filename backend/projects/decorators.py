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
            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(Q(id=data.get('id')) | Q(id=data.get('project_id')))
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
            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)

            project = Project.objects.get(Q(id=data.get('id')) | Q(id=data.get('project_id')))
            user = User.objects.get(id=request.user.id)
            if project.project_owner != user:
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
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)


            if data.get('sprint_id'):
                sprint = Sprint.objects.get(id=data['sprint_id'])

                if sprint.end_date <= now().date():

                    sprints_tasks = Task.objects.filter(Q(sprint=sprint) & (Q(status='To Do') | Q(status='In Progress')))

                    for task in sprints_tasks:
                        if task.status == 'To Do':
                            task.sprint = None
                            task.user = None
                        elif task.status == 'In Progress':
                            task.sprint = None
                            task.user = None
                            task.status = 'To Do'

                        task.save()
                    sprint.save()

                    return JsonResponse({"message": "Sprint się już zakończył."}, status=400, safe=False)

            elif data.get('task_id'):
                task_temp = Task.objects.get(id=data['task_id'])
                sprint = task_temp.sprint

                if sprint.end_date <= now().date():

                    sprints_tasks = Task.objects.filter(
                        Q(sprint=sprint) & (Q(status='To Do') | Q(status='In Progress')))

                    for task in sprints_tasks:
                        if task.status == 'To Do':
                            task.sprint = None
                            task.user = None
                            task.save()
                        elif task.status == 'In Progress':
                            task.sprint = None
                            task.user = None
                            task.status = 'To Do'
                            task.save()


                    sprint.save()

                    return JsonResponse({"message": "Sprint się już zakończył."}, status=400, safe=False)

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view

def did_sprint_end_for_get(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:

            if request.method == 'GET':
                data = request.GET
            elif request.method == 'POST':
                data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({"message": "Użytkownik nie jest zalogowany"}, status=403)


            if data.get('sprint_id'):
                sprint = Sprint.objects.get(id=data['sprint_id'])

                if sprint.end_date <= now().date():

                    sprints_tasks = Task.objects.filter(Q(sprint=sprint) & (Q(status='To Do') | Q(status='In Progress')))

                    for task in sprints_tasks:
                        if task.status == 'To Do':
                            task.sprint = None
                            task.user = None
                        elif task.status == 'In Progress':
                            task.sprint = None
                            task.user = None
                            task.status = 'To Do'

                        task.save()
                    sprint.save()


            elif data.get('task_id'):
                task_temp = Task.objects.get(id=data['task_id'])
                sprint = task_temp.sprint

                if sprint.end_date <= now().date():

                    sprints_tasks = Task.objects.filter(
                        Q(sprint=sprint) & (Q(status='To Do') | Q(status='In Progress')))

                    for task in sprints_tasks:
                        if task.status == 'To Do':
                            task.sprint = None
                            task.user = None
                            task.save()
                        elif task.status == 'In Progress':
                            task.sprint = None
                            task.user = None
                            task.status = 'To Do'
                            task.save()


                    sprint.save()

            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({"message": "Wystąpił nieznany błąd.", "error:": str(e)}, status=400)

    return _wrapped_view