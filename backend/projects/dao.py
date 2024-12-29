from xxlimited_35 import error

from django.utils.timezone import now
from django.forms.models import model_to_dict
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Project, DevelopmentTeam, Task, TaskHistory, Sprint
from django.db.models import Q
from .utils import generate_random_string


def handle_get_project(data):
    try:

        project = Project.objects.get(id=data['id'])
        development_team = DevelopmentTeam.objects.filter(project=project.id)
        project_users = project.project_users.all()
        users_data = []

        for user in project_users:
            role = None
            for developer in development_team:
                if developer.user == user:
                    role = developer.role
                    break

            users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': role
            })

        project_data = {
            'id': project.id,
            'title': project.title,
            'project_owner': {
                'id': project.project_owner.id,
                'username': project.project_owner.username,
                'email': project.project_owner.email,
                'first_name': project.project_owner.first_name,
                'last_name': project.project_owner.last_name
            },
            'project_users': users_data,
            'invite_code': project.invite_code,
            'scrum_master': {
                'id': project.scrum_master.id,
                'username': project.scrum_master.username,
                'email': project.scrum_master.email,
                'first_name': project.scrum_master.first_name,
                'last_name': project.scrum_master.last_name
            } if project.scrum_master else None,
            'product_owner': {
                'id': project.product_owner.id,
                'username': project.product_owner.username,
                'email': project.product_owner.email,
                'first_name': project.product_owner.first_name,
                'last_name': project.product_owner.last_name
            } if project.product_owner else None,
            'description': project.description,

        }
        return JsonResponse(project_data, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania projektu.", "error": str(e)}, status=400, safe=False)


def handle_get_project_backlog(data):
    try:
        project = Project.objects.get(id=data['id'])
        tasks = Task.objects.filter(Q(project_backlog=project.id) & Q(sprint=None))

        tasks_data = []
        for task in tasks:

            tasks_history = TaskHistory.objects.filter(task=task.id)
            tasks_history_json = [model_to_dict(task_history)for task_history in tasks_history]

            task_sprint = ""
            task_user = ""
            if task.sprint is not None:
                task_sprint = task.sprint.id
            if task.user is not None:
                task_user = task.user.id

            tasks_data.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "sprint": task_sprint,
                "project_backlog": task.project_backlog.id,
                "user": task_user,
                "created": task.created,
                "tasks_history": tasks_history_json
            })

        return JsonResponse(tasks_data, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania projektu.", "error": str(e)}, status=400, safe=False)

def handle_get_sprints(data):
    try:
        project = Project.objects.get(id=data['id'])

        ongoing_sprints = Sprint.objects.filter(
            Q(start_date__lte=now().date()) & Q(end_date__gte=now().date()) & Q(project=project.id)
        )
        future_sprints= Sprint.objects.filter(
            Q(start_date__gt=now().date()) & Q(project=project.id)
        )

        ended_sprints = Sprint.objects.filter(
            Q(end_date__lt=now().date()) & Q(project=project.id)
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

            })

        sprints_data.append({
            "future": future_sprints_data,
            "ongoing": ongoing_sprints_data,
            "ended": ended_sprints_data,
        })


        return JsonResponse(sprints_data, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania projektu.", "error": str(e)}, status=400, safe=False)



def get_users_projects_dashboard(data):

    try:
        projects = Project.objects.filter(
            Q(project_owner=data['id']) | Q(project_users=data['id'])
        ).distinct()

        projects_list = []
        for project in projects:

            development_team = DevelopmentTeam.objects.filter(project=project.id)
            project_users = project.project_users.all()
            role = None

            for user in project_users:
                for developer in development_team:
                    if developer.user == user:
                        role = developer.role
                        break

            project_data = {
                'id': project.id,
                'title': project.title,
                'project_owner_username': project.project_owner.username,
                'project_owner_first_name': project.project_owner.first_name,
                'project_owner_last_name': project.project_owner.last_name,
                'role': role,
                'description': project.description,
            }

            projects_list.append(project_data)

        return JsonResponse(projects_list, status=200, safe=False)

    except error:

        return JsonResponse(error, status=400, safe=False)


def handle_remove_project(request, data):
    try:
        user_in_project = DevelopmentTeam.objects.filter(user_id=request.user.id, project_id=data['id'])
        project = Project.objects.get(id=data['id'])
        user_to_remove = User.objects.get(id=request.user.id)

        project.project_users.remove(user_to_remove)
        user_in_project.delete()

        return JsonResponse({"message": "Opuszczono projekt pomyślnie."}, status=200, safe=False)
    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas opuszczania projektu."}, status=400, safe=False)


def handle_delete_project(data):
    try:
        project = Project.objects.get(id=data['id'])
        project.delete()

        return JsonResponse({"message": "Usunięto projekt pomyślnie."}, status=200, safe=False)
    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania projektu."}, status=400, safe=False)


def handle_join_project(user, data):
    try:

        project = Project.objects.get(invite_code=data['invite_code'])
        user_to_add = User.objects.get(id=user.id)
        if project.project_users.filter(id=user.id).exists():
            return JsonResponse({"message": "Użytkownik już jest przypisany do tego projektu."}, status=400, safe=False)

        project.project_users.add(user_to_add)
        return JsonResponse({"message": "Dołączono do projektu pomyślnie."}, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"message": "Podany kod jest błędny."}, status=400, safe=False)


def handle_create_project(user, data):

    invite_code = generate_random_string(10)

    while True:
        if Project.objects.filter(invite_code=invite_code).exists():
            invite_code = generate_random_string(10)
        else:
            break

    try:

        if data['description'].strip() == "":
            data['description'] = ""

        project = Project(
            title=data['title'],
            project_owner=user,
            description=data['description'],
            product_owner=None,
            scrum_master=None,
            invite_code=invite_code
        )
        project.save()

        return JsonResponse({"message": "Stworzono projekt pomyślnie."}, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd.", "error": str(e)}, status=400, safe=False)


def handle_remove_task(data):
    try:
        task = Task.objects.get(id=data['taskId'])
        task.delete()

        return JsonResponse({"message": "Usunięto task pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania taska."}, status=400, safe=False)


def handle_remove_sprint(data):
    try:
        sprint = Sprint.objects.get(id=data['sprintId'])
        sprint.delete()

        return JsonResponse({"message": "Usunięto sprint pomyślnie."}, status=200, safe=False)

    except Sprint.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania sprintu."}, status=400, safe=False)
