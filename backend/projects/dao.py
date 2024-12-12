from xxlimited_35 import error

from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Project, DevelopmentTeam
from django.db.models import Q


"""def get_users_projects(data):

    try:
        projects = Project.objects.filter(
            Q(project_owner=data['id']) | Q(project_users=data['id']) #do zmiany data["admin"]['id']
        ).distinct()

        projects_list = []
        for project in projects:

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

            projects_list.append(project_data)

        return JsonResponse(projects_list, status=200, safe=False)

    except error:

        return JsonResponse(error, status=400, safe=False)
"""

def get_users_projects_dashboard(data):

    try:
        projects = Project.objects.filter(
            Q(project_owner=data['id']) | Q(project_users=data['id']) #do zmiany data["admin"]['id']
        ).distinct()

        projects_list = []
        for project in projects:

            development_team = DevelopmentTeam.objects.filter(project=project.id)
            project_users = project.project_users.all()
            users_data = []
            role = None

            for user in project_users:
                for developer in development_team:
                    if developer.user == user:
                        role = developer.role
                        break

            project_data = {
                'id': project.id,
                'title': project.title,
                'project_owner_first_name': project.project_owner.first_name,
                'project_owner_last_name': project.project_owner.last_name,
                'role': role,
                'description': project.description,
            }

            projects_list.append(project_data)

        return JsonResponse(projects_list, status=200, safe=False)

    except error:

        return JsonResponse(error, status=400, safe=False)
