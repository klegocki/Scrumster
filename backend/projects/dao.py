from datetime import datetime
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Project, DevelopmentTeam, Task, TaskHistory, Sprint
from django.db.models import Prefetch, Q
from .utils import generate_random_string, get_polish_datetime_with_timezone

def handle_get_project(data):
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

        tasks_in_proggres = []
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

            if tasks_data_temp['user'] and tasks_data_temp['user']['id'] == request.user.id and tasks_data_temp['status'] != "Ukończone" and tasks_data_temp['status'] != "Do zatwierdzenia":
                users_tasks.append(tasks_data_temp)

            elif tasks_data_temp['status'] == "Do zrobienia":
                tasks_to_do.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "W trakcie":
                tasks_in_proggres.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "Ukończone":
                tasks_done.append(tasks_data_temp)

            elif tasks_data_temp['status']  == "Do zatwierdzenia":
                tasks_to_approve.append(tasks_data_temp)

        tasks_data.append({
            "toDo": tasks_to_do,
            "inProgress": tasks_in_proggres,
            "done": tasks_done,
            "usersTasks": users_tasks,
            "toApprove" : tasks_to_approve,
        })

        return JsonResponse(tasks_data, status=200, safe=False)

    except Project.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Projekt nie istnieje."}, status=400, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd: Zadanie nie istnieje."}, status=400, safe=False)


def handle_remove_task_from_sprint(data):
    try:
        task = Task.objects.get(id=data['taskId'])
        task.sprint = None
        task.save()

        return JsonResponse({"message": "Usunięto task pomyślnie."}, status=200, safe=False)

    except Task.DoesNotExist:
        return JsonResponse({"message": "Wystąpił błąd podczas usuwania taska."}, status=400, safe=False)


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
