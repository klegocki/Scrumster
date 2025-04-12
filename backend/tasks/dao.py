from datetime import datetime
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.http import JsonResponse
from projects.models import Project, DevelopmentTeam
from sprints.models import Sprint
from .models import Task, TaskHistory
from django.db.models import Prefetch, Q
from scrumster.utils import generate_random_string, get_polish_datetime_with_timezone


def handle_create_task(data):
    try:
        project = Project.objects.get(id=data['id'])

        if data['title'].strip() == "":
            return JsonResponse({"message": "Tytuł nie może być pusty"}, status=400, safe=False)

        if data['description'].strip() == "":
            data['description'] = ""

        task = Task(
            title=data['title'],
            description=data['description'],
            status="Do zrobienia",
            sprint=None,
            project_backlog=project,
            user=None,
            estimated_hours=None,
        )
        task.save()

        return JsonResponse({"message": "Stworzono zadanie pomyślnie."}, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_remove_task(data):
    try:
        task = Task.objects.get(id=data['taskId'])
        task.delete()

        return JsonResponse({"message": "Usunięto task pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania taska."}, status=400, safe=False)




def handle_remove_task_from_sprint(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        task.sprint = None
        task.save()

        return JsonResponse({"message": "Usunięto task pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania taska."}, status=400, safe=False)




def handle_assign_developer_task(request, data):

    if not request.user.is_authenticated:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)

    if not data['git_link']:
        return JsonResponse({"message": "Proszę podać link do strony kontroli wersji"}, status=400)

    try:
        task = Task.objects.get(id=data['task_id'])
        task.estimated_hours = float(data['estimated_hours'])
        task.status = "W trakcie"
        task.git_link = data['git_link']
        task.user = request.user
        task.save()

        return JsonResponse({"message": "Pomyślnie przypisano użytkownika do zadania ."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Nie ma takiego zadania."}, status=400, safe=False)


def handle_sprint_backlog_task_user_revert(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        task.estimated_hours = None
        task.status = "Do zrobienia"
        task.git_link = None
        task.user = None
        task.save()

        return JsonResponse({"message": "Przywrócono z zadanie spowrotem do backlogu sprintu."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas przywracania zadania do backlogu sprintu."}, status=400, safe=False)


def handle_sprint_task_completion(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        task.status = "Do zatwierdzenia"
        task.save()

        return JsonResponse({"message": "Oddano zadanie do zatwierdzenia pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas oddawania zadania do potwierdzenia."}, status=400, safe=False)


def handle_get_project_completed_tasks(data):
    try:
        project = Project.objects.prefetch_related(
            Prefetch('project_backlog_tasks',
                queryset=Task.objects.select_related('user', 'sprint')
                          .filter(status="Ukończone")
                          .prefetch_related(
                              Prefetch('project_backlog_tasks',
                                  queryset=TaskHistory.objects.select_related('user', 'sprint')
                                            .order_by('-changed_at')
                              )
                          )
            )
        ).get(id=data['id'])

        return JsonResponse([{
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "sprint": f"Sprint {task.sprint.start_date} {task.sprint.end_date}" if task.sprint else None,
            "project_backlog": task.project_backlog.id,
            "estimated_hours": task.estimated_hours,
            "git_link": task.git_link,
            "user": {
                'id': task.user.id,
                'username': task.user.username,
                'email': task.user.email,
                'first_name': task.user.first_name,
                'last_name': task.user.last_name
            } if task.user else None,
            "created": get_polish_datetime_with_timezone(task.created),
            "tasks_history": [{
                "id": history.id,
                "title": history.title,
                "description": history.description,
                "status": history.status,
                "sprint": f"Sprint {history.sprint.start_date} {history.sprint.end_date}" if history.sprint else None,
                "user": {
                    'id': history.user.id,
                    'username': history.user.username,
                    'email': history.user.email,
                    'first_name': history.user.first_name,
                    'last_name': history.user.last_name
                } if history.user else None,
                "changed_at": get_polish_datetime_with_timezone(history.changed_at),
                "estimated_hours": history.estimated_hours
            } for history in sorted(task.project_backlog_tasks.all(), key=lambda h: h.changed_at, reverse=True)]
        } for task in project.project_backlog_tasks.all()], safe=False, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400)

def handle_get_users_tasks(data):
    try:
        project = Project.objects.prefetch_related(
            Prefetch('project_backlog_tasks',
                queryset=Task.objects.select_related('user', 'sprint')
                          .filter(user=data['user_id'])
                          .prefetch_related(
                              Prefetch('project_backlog_tasks',
                                  queryset=TaskHistory.objects.select_related('user', 'sprint')
                                            .order_by('-changed_at')
                              )
                          )
            )
        ).get(id=data['project_id'])

        return JsonResponse([{
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "sprint": f"Sprint {task.sprint.start_date} {task.sprint.end_date}" if task.sprint else None,
            "created": get_polish_datetime_with_timezone(task.created),
        } for task in project.project_backlog_tasks.all()], safe=False, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400)


def handle_search_users_tasks(data):
    try:
        if data['search']:
            project = Project.objects.prefetch_related(
                Prefetch('project_backlog_tasks',
                    queryset=Task.objects.select_related('user', 'sprint')
                              .filter(
                                    Q(user=data['user_id']) & (
                                    Q(title__icontains=data['search']) |
                                    Q(description__icontains=data['search']) |
                                    Q(status__icontains=data['search'])
                                    )
                                )
                              .prefetch_related(
                                  Prefetch('project_backlog_tasks',
                                      queryset=TaskHistory.objects.select_related('user', 'sprint')
                                                .order_by('-changed_at')
                                  )
                              )
                )
            ).get(id=data['project_id'])
        else:
            project = Project.objects.prefetch_related(
                Prefetch('project_backlog_tasks',
                         queryset=Task.objects.select_related('user', 'sprint')
                         .filter(user=data['user_id'])
                         .prefetch_related(
                             Prefetch('project_backlog_tasks',
                                      queryset=TaskHistory.objects.select_related('user', 'sprint')
                                      .order_by('-changed_at')
                                      )
                         )
                         )
            ).get(id=data['project_id'])

        return JsonResponse([{
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "sprint": f"Sprint {task.sprint.start_date} {task.sprint.end_date}" if task.sprint else None,
            "created": get_polish_datetime_with_timezone(task.created),
        } for task in project.project_backlog_tasks.all()], safe=False, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400)

def handle_add_tasks_to_existing_sprint(data):

    task_ids = data['task_ids']

    if not task_ids:
        return JsonResponse({"message": "Aby utworzyć sprint, musisz przypisać do niego zadania."}, status=400, safe=False)

    try:
        sprint = Sprint.objects.get(id=data['sprint_id'])
        for task_id in task_ids:
            task = Task.objects.get(id=task_id)
            task.sprint = sprint
            task.save()

        return JsonResponse({"message": "Dodano zadania pomyślnie."}, status=200, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Sprint nie istnieje."}, status=400, safe=False)

def handle_approve_task(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        task.status = "Ukończone"
        task.save()

        return JsonResponse({"message": "Zakończono zadanie pomyślnie"}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas kończenia zadania."}, status=400, safe=False)


def handle_reject_task(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        sprint = task.sprint

        if sprint.end_date < now().date() or sprint.manually_ended:
            task.status = "Do zrobienia"
            task.sprint = None
            task.estimated_hours = None
            task.git_link = None
            task.user = None
            task.save()
            return JsonResponse({"message": "Odrzucono zadanie pomyślnie. Zadanie wraca do backlogu produktu."}, status=200, safe=False)

        else:
            task.status = "Do zrobienia"
            task.user = None
            task.estimated_hours = None
            task.git_link = None
            task.save()
            return JsonResponse({"message": "Odrzucono zadanie pomyślnie. Zadanie wraca do backlogu sprintu."}, status=200, safe=False)



    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas odrzucania zadania."}, status=400, safe=False)
