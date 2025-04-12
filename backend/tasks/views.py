from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import GetProjectSerializer, DeleteTaskSerializer, CreateTaskSerializer, \
    DeleteTaskFromSprintSerializer, AssignDeveloperToTaskSerializer, RevertTaskDeveloperSerializer, \
    SprintTaskCompletionSerializer, GetUsersTasksSerializer, SearchUsersTasksSerializer, \
    AddTasksToExistingSprintSerializer
from .dao import handle_remove_task, handle_create_task, handle_remove_task_from_sprint, handle_assign_developer_task, \
    handle_sprint_backlog_task_user_revert, handle_sprint_task_completion, handle_get_project_completed_tasks, \
    handle_get_users_tasks, handle_search_users_tasks, handle_add_tasks_to_existing_sprint, handle_approve_task, \
    handle_reject_task
from scrumster.decorators import product_owner, scrum_master, did_sprint_end



@api_view(['GET'])
def get_project_completed_tasks(request):
    if request.user.is_authenticated:
        serializer = GetProjectSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_project_completed_tasks(serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@product_owner
@api_view(['POST'])
def delete_task(request):
    serializer = DeleteTaskSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@product_owner
@api_view(['POST'])
def create_task(request):
    serializer = CreateTaskSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_create_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@did_sprint_end
@api_view(['POST'])
def delete_task_from_sprint(request):
    serializer = DeleteTaskFromSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_task_from_sprint(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@did_sprint_end
@api_view(['POST'])
def assign_developer_task(request):
    serializer = AssignDeveloperToTaskSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_assign_developer_task(request, serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@did_sprint_end
@api_view(['POST'])
def sprint_backlog_task_user_revert(request):
    serializer = RevertTaskDeveloperSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_sprint_backlog_task_user_revert(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@did_sprint_end
@api_view(['POST'])
def sprint_task_completion(request):
    serializer = SprintTaskCompletionSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_sprint_task_completion(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['GET'])
def get_users_tasks(request):
    if request.user.is_authenticated:
        serializer = GetUsersTasksSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_users_tasks(serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@api_view(['GET'])
def search_users_tasks(request):
    if request.user.is_authenticated:
        serializer = SearchUsersTasksSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_search_users_tasks(serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)


@did_sprint_end
@scrum_master
@api_view(['POST'])
def add_tasks_to_existing_sprint(request):
    serializer = AddTasksToExistingSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_add_tasks_to_existing_sprint(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def approve_task(request):
    serializer = SprintTaskCompletionSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_approve_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def reject_task(request):
    serializer = SprintTaskCompletionSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_reject_task(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


