from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Project, DevelopmentTeam
from tasks.models import Task, TaskHistory
from django.db.models import Prefetch, Q
from scrumster.utils import generate_random_string, get_polish_datetime_with_timezone

def handle_get_project_info(data):
    try:

        project = Project.objects.get(id=data['id'])
        development_team = DevelopmentTeam.objects.filter(project=project.id)
        project_users = project.project_users.all()
        users_data = []
        alt_role = None
        for user in project_users:
            role = None

            if user == project.product_owner:
                role = "Właściciel produktu"

            if user == project.scrum_master:
                role = "Scrum master"

            if development_team:
                for developer in development_team:
                    if developer.user == user:
                        if user == project.scrum_master:
                            role = "Scrum master"
                            alt_role=developer.role
                            break
                        role = developer.role
                        break


            users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': role,
                "altRole": alt_role,
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

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Nie ma takiego projektu."}, status=400, safe=False)


def handle_get_project_backlog(data):
    try:
        project = Project.objects.prefetch_related(
            Prefetch('project_backlog_tasks',
                queryset=Task.objects.select_related('user', 'sprint')
                          .filter(Q(sprint__isnull=True) & Q(status="Do zrobienia"))
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
            "user": {
                'id': task.user.id,
                'username': task.user.username,
                'email': task.user.email,
                'first_name': task.user.first_name,
                'last_name': task.user.last_name
            } if task.user else None,
            "created": get_polish_datetime_with_timezone(task.created),
            "git_link": task.git_link,
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
            } for history in task.project_backlog_tasks.all()]
        } for task in project.project_backlog_tasks.all()], safe=False, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400)


def get_users_projects_dashboard(request, data):

    try:
        projects = Project.objects.filter(
            Q(project_owner=data['id']) | Q(project_users=data['id'])
        ).distinct()

        logged_user = User.objects.get(id=request.user.id)

        projects_list = []
        for project in projects:

            role = None
            alt_role = None
            if logged_user == project.project_owner:
                role = "Administrator projektu"

            elif logged_user == project.product_owner:
                role = "Właściciel produktu"

            elif logged_user == project.scrum_master:
                role = "Scrum master"
                try:
                    development_team = DevelopmentTeam.objects.get(Q(project=project.id) & Q(user=logged_user))
                    if role:
                        alt_role = development_team.role
                    else:
                        role = development_team.role
                except:
                    pass

            else:
                try:
                    development_team = DevelopmentTeam.objects.get(Q(project=project.id) & Q(user=logged_user))
                    role = development_team.role
                except:
                    pass

            project_data = {
                'id': project.id,
                'title': project.title,
                'project_owner_username': project.project_owner.username,
                'project_owner_first_name': project.project_owner.first_name,
                'project_owner_last_name': project.project_owner.last_name,
                'role': role,
                'altRole': alt_role,
                'description': project.description,
            }

            projects_list.append(project_data)

        return JsonResponse(projects_list, status=200, safe=False)

    except Project.DoesNotExist:

        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_remove_project(request, data):
    try:
        user_in_project = DevelopmentTeam.objects.filter(user_id=request.user.id, project_id=data['id'])
        project = Project.objects.get(id=data['id'])

        users_tasks = Task.objects.filter(Q(project_backlog=project) & Q(user=request.user) & (Q(status='Do zrobienia') | Q(status="W trakcie")))

        for task in users_tasks:
            task.user = None
            task.status = "Do zrobienia"
            task.save()

        project.project_users.remove(request.user)
        user_in_project.delete()

        return JsonResponse({"message": "Opuszczono projekt pomyślnie."}, status=200, safe=False)
    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_delete_project(data):
    try:
        project = Project.objects.get(id=data['id'])
        project.delete()

        return JsonResponse({"message": "Usunięto projekt pomyślnie."}, status=200, safe=False)
    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)


def handle_join_project(user, data):
    try:

        project = Project.objects.get(invite_code=data['invite_code'])
        user_to_add = User.objects.get(id=user.id)
        if project.project_users.filter(id=user.id).exists():
            return JsonResponse({"message": "Użytkownik już jest przypisany do tego projektu."}, status=400, safe=False)

        project.project_users.add(user_to_add)
        return JsonResponse({"message": "Dołączono do projektu pomyślnie."}, status=200, safe=False)

    except Project.DoesNotExist:
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


def handle_set_user_project_role(data):
    try:
        project = Project.objects.get(id=data['project_id'])
        user = User.objects.get(id=data['user_id'])

        if data['role'] == "Scrum master":
            project.scrum_master = user
            project.save()

            return JsonResponse({"message": "Dodane rolę scrum mastera."}, status=200, safe=False)

        elif data['role'] == "Właściciel produktu":
            project.product_owner = user
            project.save()

            return JsonResponse({"message": "Dodane rolę właściciela produktu."}, status=200, safe=False)

        else:

            try:
                test = DevelopmentTeam.objects.get(Q(project=project) & Q(user=user))
                return JsonResponse({"message": "Wystąpił błąd: Użytkownik posiada rolę."}, status=400, safe=False)

            except DevelopmentTeam.DoesNotExist:
                if project.product_owner == user:
                    return JsonResponse({"message": "Wystąpił błąd: właściciel produktu nie może być deweloperem."}, status=400, safe=False)

                developer = DevelopmentTeam(
                    user=user,
                    role=data['role'],
                    project=project
                )
                developer.save()

                return JsonResponse({"message": "Dodane rolę dewelopera."}, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)

    except User.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Użytkownik nie istnieje."}, status=400, safe=False)


def handle_delete_user_project_role(data):
    try:
        project = Project.objects.get(id=data['project_id'])
        user = User.objects.get(id=data['user_id'])

        if project.product_owner == user:
            project.product_owner = None
            project.save()

        elif project.scrum_master == user:
            project.scrum_master = None
            project.save()
            try:
                users_developer_role = DevelopmentTeam.objects.get(Q(project=project) & Q(user=user))
                users_developer_role.delete()

            except DevelopmentTeam.DoesNotExist:
                pass
        else:
            try:
                users_developer_role = DevelopmentTeam.objects.get(Q(project=project) & Q(user=user))
                users_developer_role.delete()

                return JsonResponse({"message": "Usunięto rolę pomyślnie."}, status=200, safe=False)

            except DevelopmentTeam.DoesNotExist:
                return JsonResponse({"message": "Wystąpił błąd: Użytkownik nie posiada roli."}, status=400, safe=False)

        return JsonResponse({"message": "Usunięto rolę pomyślnie."}, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)

    except User.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Użytkownik nie istnieje."}, status=400, safe=False)
