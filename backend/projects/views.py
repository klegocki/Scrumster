from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, DeleteProjectSerializer, LeaveProjectSerializer, JoinProjectSerializer, \
    CreateProjectSerializer, GetProjectSerializer, SetUserProjectRoleSerializer, DeleteUserProjectRoleSerializer
from projects.dao import get_users_projects_dashboard, handle_remove_project, handle_delete_project, \
    handle_join_project, handle_create_project, handle_get_project_info, handle_get_project_backlog, \
    handle_set_user_project_role, handle_delete_user_project_role
from scrumster.decorators import project_owner


@api_view(['GET'])
def get_projects(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = get_users_projects_dashboard(request, serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['GET'])
def get_project_info(request):
    if request.user.is_authenticated:
        serializer = GetProjectSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_project_info(serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)

@api_view(['GET'])
def get_project_backlog(request):
    if request.user.is_authenticated:
        serializer = GetProjectSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_project_backlog(serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@project_owner
@api_view(['POST'])
def delete_project(request):
    serializer = DeleteProjectSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_delete_project(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def leave_project(request):
    serializer = LeaveProjectSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_project(request, serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def join_project(request):
    serializer = JoinProjectSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_join_project(request.user, serializer.initial_data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def create_project(request):
    serializer = CreateProjectSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_create_project(request.user, serializer.initial_data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@project_owner
@api_view(['POST'])
def set_user_project_role(request):
    serializer = SetUserProjectRoleSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_set_user_project_role(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@project_owner
@api_view(['POST'])
def delete_user_project_role(request):
    serializer = DeleteUserProjectRoleSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_delete_user_project_role(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
