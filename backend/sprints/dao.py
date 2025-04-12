from datetime import datetime
from django.utils.timezone import now
from django.http import JsonResponse
from projects.models import Project, DevelopmentTeam
from .models import Sprint
from tasks.models import Task, TaskHistory
from django.db.models import Q
from scrumster.utils import get_polish_datetime_with_timezone


def handle_get_sprints(data):
    try:
        project = Project.objects.get(id=data['id'])

        ongoing_sprints = Sprint.objects.filter(
            Q(start_date__lte=now().date()) & Q(end_date__gte=now().date()) & Q(project=project.id) & Q(manually_ended=False)
        )
        future_sprints= Sprint.objects.filter(
            Q(start_date__gt=now().date()) & Q(project=project.id)
        )

        ended_sprints = Sprint.objects.filter(
            (Q(end_date__lt=now().date()) & Q(project=project.id)) | Q(manually_ended=True)
        )

        future_sprints_data = []
        ongoing_sprints_data = []
        ended_sprints_data = []
        sprints_data = []

        for sprint in ongoing_sprints:
            ongoing_sprints_data.append({
                "id": sprint.id,
                "start_date": sprint.start_date,
                "end_date": sprint.end_date,
                "daily_meet_link": sprint.daily_meet_link,
                "sprint_review": sprint.sprint_review,
                "project":project.id,
                "title": "Sprint " + str(sprint.start_date) + " " + str(sprint.end_date),
                "alt_title": sprint.title,
            })

        for sprint in future_sprints:
            future_sprints_data.append({
                "id": sprint.id,
                "start_date": sprint.start_date,
                "end_date": sprint.end_date,
                "daily_meet_link": sprint.daily_meet_link,
                "sprint_review": sprint.sprint_review,
                "project":project.id,
                "title": "Sprint " + str(sprint.start_date) + " " + str(sprint.end_date),
                "alt_title": sprint.title,

            })

        for sprint in ended_sprints:
            ended_sprints_data.append({
                "id": sprint.id,
                "start_date": sprint.start_date,
                "end_date": sprint.end_date,
                "daily_meet_link": sprint.daily_meet_link,
                "sprint_review": sprint.sprint_review,
                "project":project.id,
                "title": "Sprint " + str(sprint.start_date) + " " + str(sprint.end_date),
                "alt_title": sprint.title,

            })

        sprints_data.append({
            "future": future_sprints_data,
            "ongoing": ongoing_sprints_data,
            "ended": ended_sprints_data,
        })


        return JsonResponse(sprints_data, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_remove_sprint(data):
    try:
        sprint = Sprint.objects.get(id=data['sprintId'])
        sprint.delete()

        return JsonResponse({"message": "Usunięto sprint pomyślnie."}, status=200, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania sprintu."}, status=400, safe=False)


def handle_create_sprint(data):

    task_ids = data['task_ids']
    today = now().date()
    start_date = datetime.strptime(data['start_date'], "%Y-%m-%d").date()
    end_date = datetime.strptime(data['end_date'], "%Y-%m-%d").date()

    if today > start_date:
        return JsonResponse({"message": "Nie można stworzyć sprintu, który się rozpoczyna w przeszłości"}, status=400, safe=False)
    elif today > end_date:
        return JsonResponse({"message": "Nie można stworzyć sprintu, który się zakończył"}, status=400, safe=False)


    if start_date > end_date:
        return JsonResponse({"message": "Data początkowa, nie może być późniejsza, niż data końcowa."}, status=400, safe=False)

    if not task_ids:
        return JsonResponse({"message": "Aby utworzyć sprint, musisz przypisać do niego zadania."}, status=400, safe=False)

    try:
        project = Project.objects.get(id=data['id'])
        if data['title']:
            sprint_title = data['title']
        else:
            sprint_title = None
        sprint = Sprint(
            start_date=data['start_date'],
            end_date=data['end_date'],
            daily_meet_link=data['daily_meet_link'],
            project=project,
            title=sprint_title

        )
        sprint.save()
        for task_id in task_ids:
            task = Task.objects.get(id=task_id)
            task.sprint = sprint
            task.save()

        return JsonResponse({"message": "Stworzono sprint pomyślnie."}, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_get_sprint_backlog(request, data):
    try:
        project = Project.objects.get(id=data['project_id'])
        sprint = Sprint.objects.get(id=data['sprint_id'])
        tasks = Task.objects.filter(Q(project_backlog=project.id) & Q(sprint=sprint.id))

        tasks_in_progress = []
        tasks_to_do = []
        users_tasks = []
        tasks_done = []
        tasks_to_approve = []
        tasks_data = []
        for task in tasks:
            tasks_history_data = []

            tasks_history = TaskHistory.objects.filter(task=task.id)
            for task_history in tasks_history:
                tasks_history_data.append({
                    "id": task_history.id,
                    "title": task_history.title,
                    "description": task_history.description,
                    "status": task_history.status,
                    "sprint": "Sprint " + str(task_history.sprint.start_date) + " " + str(
                        task_history.sprint.end_date) if task_history.sprint else None,
                    'user': {
                        'id': task_history.user.id,
                        'username': task_history.user.username,
                        'email': task_history.user.email,
                        'first_name': task_history.user.first_name,
                        'last_name': task_history.user.last_name
                    } if task_history.user else None,
                    "changed_at": get_polish_datetime_with_timezone(task_history.changed_at),
                    "estimated_hours": task_history.estimated_hours,
                })

            tasks_history_data.sort(key=lambda x: x['changed_at'], reverse=True)
            tasks_data_temp={
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "sprint": "Sprint " + str(task.sprint.start_date) + " " + str(task.sprint.end_date) if task.sprint else None,
                "project_backlog": task.project_backlog.id,
                "estimated_hours": task.estimated_hours,
                "git_link":task.git_link,
                'user': {
                    'id': task.user.id,
                    'username': task.user.username,
                    'email': task.user.email,
                    'first_name': task.user.first_name,
                    'last_name': task.user.last_name
            } if task.user else None,
                "created": get_polish_datetime_with_timezone(task.created),
                "tasks_history": tasks_history_data
            }

            if tasks_data_temp['user'] and tasks_data_temp['user']['id'] == request.user.id and tasks_data_temp['status'] != "Ukończone":
                if project.scrum_master == request.user and tasks_data_temp['status'] == "Do zatwierdzenia":
                    tasks_to_approve.append(tasks_data_temp)
                else:
                    users_tasks.append(tasks_data_temp)

            elif tasks_data_temp['status'] == "Do zrobienia":
                tasks_to_do.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "W trakcie":
                tasks_in_progress.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "Ukończone":
                tasks_done.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "Do zatwierdzenia":
                tasks_to_approve.append(tasks_data_temp)

        tasks_data.append({
            "toDo": tasks_to_do,
            "inProgress": tasks_in_progress,
            "done": tasks_done,
            "usersTasks": users_tasks,
            "toApprove" : tasks_to_approve,
        })

        return JsonResponse(tasks_data, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Zadanie nie istnieje."}, status=400, safe=False)


def handle_get_sprint_info(request, data):
    try:
        sprint = Sprint.objects.get(id=data['sprint_id'])
        on_going_sprint = False

        if sprint.start_date <= now().date() <= sprint.end_date:
            on_going_sprint = True

        role = None
        is_scrum_master_developer = False
        try:
            development_team = DevelopmentTeam.objects.get(Q(project=sprint.project) & Q(user=request.user))
            if development_team.user == request.user:
                role = development_team.role
                if sprint.project.scrum_master == request.user:
                    is_scrum_master_developer = True
                    role = "Scrum master"

        except DevelopmentTeam.DoesNotExist:
            if sprint.project.scrum_master == request.user:
                role = "Scrum master"
            if sprint.project.project_owner == request.user:
                role = "Administrator projektu"
            elif sprint.project.product_owner == request.user:
                role = "Właściciel produktu"


        sprint_data = {
            "isScrumMasterDeveloper": is_scrum_master_developer,
            'id': sprint.id,
            'title': "Sprint " + str(sprint.start_date) + " " + str(sprint.end_date),
            'loggedInUserRole': role,
            'sprintReview':sprint.sprint_review,
            'start_date': sprint.start_date,
            'daily_meet_link': sprint.daily_meet_link,
            'sprint_review': sprint.sprint_review,
            'on_going_sprint': on_going_sprint,
        }
        return JsonResponse(sprint_data, status=200, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Nie ma takiego sprintu."}, status=400, safe=False)


def handle_add_sprint_review(data):
    try:
        sprint = Sprint.objects.get(id=data['sprint_id'])
        sprint.sprint_review = data["sprint_review"]
        sprint.save()

        return JsonResponse({"message": "Dodano raport sprintu pomyślnie"}, status=200, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas dodawania raportu sprintu."}, status=400, safe=False)


def handle_end_sprint(data):
    try:
        sprint = Sprint.objects.get(id=data['sprint_id'])

        if sprint.end_date < now().date():
            return JsonResponse({"message": "Sprint się już zakończył."}, status=400, safe=False)

        if sprint.start_date > now().date():
            return JsonResponse({"message": "Nie można zakończyć sprintu, który się nie rozpoczął."}, status=400, safe=False)

        sprint.end_date = now().date()
        sprint.manually_ended = True
        sprints_tasks = Task.objects.filter(Q(sprint=sprint) & (Q(status='Do zrobienia') | Q(status='W trakcie')))

        for task in sprints_tasks:
            if task.status == 'Do zrobienia':
                task.sprint = None
            elif task.status == "W trakcie":
                task.status = "Do zatwierdzenia"

            task.save()

        sprint.save()

        return JsonResponse({"message": "Zakończono sprint pomyślnie"}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas kończenia sprintu."}, status=400, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas kończenia sprintu."}, status=400, safe=False)


def handle_remove_task_from_sprint(data):
    try:
        task = Task.objects.get(id=data['task_id'])
        task.sprint = None
        task.save()

        return JsonResponse({"message": "Usunięto task pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania taska."}, status=400, safe=False)
