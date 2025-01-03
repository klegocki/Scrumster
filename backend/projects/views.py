from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, DeleteProjectSerializer, LeaveProjectSerializer, JoinProjectSerializer, \
    CreateProjectSerializer, GetProjectSerializer, DeleteTaskSerializer, DeleteSprintSerializer, CreateTaskSerializer
from projects.dao import get_users_projects_dashboard, handle_remove_project, handle_delete_project, \
    handle_join_project, handle_create_project, handle_get_project, handle_get_project_backlog, handle_get_sprints, \
    handle_remove_task, handle_remove_sprint, handle_create_task
from projects.decorators import product_owner, project_owner, scrum_master


# Create your views here.
@api_view(['GET'])
def get_projects(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = get_users_projects_dashboard(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['GET'])
def get_project(request):
    if request.user.is_authenticated:
        serializer = GetProjectSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_project(serializer.data)
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


@api_view(['GET'])
def get_project_sprints(request):
    if request.user.is_authenticated:
        serializer = GetProjectSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_sprints(serializer.data)
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


@product_owner
@api_view(['POST'])
def delete_task(request):
    serializer = DeleteTaskSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


#@scrum_master
@api_view(['POST'])
def delete_sprint(request):
    serializer = DeleteSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_sprint(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)

#@product_owner
@api_view(['POST'])
def create_task(request):
    serializer = CreateTaskSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_create_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
