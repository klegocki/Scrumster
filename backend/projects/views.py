from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, DeleteProjectSerializer, LeaveProjectSerializer, JoinProjectSerializer, \
    CreateProjectSerializer, GetProjectSerializer, DeleteSprintSerializer, CreateTaskSerializer, \
    CreateSprintSerializer, GetSprintBacklogSerializer, GetSprintInfoSerializer, \
    SprintReviewAdditionSerializer, \
    SprintTaskCompletionSerializer, RevertTaskDeveloperSerializer, AssignDeveloperToTaskSerializer, SprintEndSerializer, \
    DeleteTaskFromSprintSerializer, DeleteTaskSerializer, SetUserProjectRoleSerializer, DeleteUserProjectRoleSerializer, \
    GetUsersTasksSerializer, SearchUsersTasksSerializer, AddTasksToExistingSprintSerializer
from projects.dao import get_users_projects_dashboard, handle_remove_project, handle_delete_project, \
    handle_join_project, handle_create_project, handle_get_project, handle_get_project_backlog, handle_get_sprints, \
    handle_remove_task, handle_remove_sprint, handle_create_task, handle_create_sprint, handle_get_sprint_backlog, \
    handle_remove_task_from_sprint, handle_get_sprint_info, handle_assign_developer_task, \
    handle_sprint_backlog_task_user_revert, handle_sprint_task_completion, handle_add_sprint_review, handle_end_sprint, \
    handle_set_user_project_role, handle_delete_user_project_role, handle_get_project_completed_tasks, \
    handle_get_users_tasks, handle_search_users_tasks, handle_add_tasks_to_existing_sprint
from projects.decorators import product_owner, project_owner, scrum_master, did_sprint_end


# Create your views here.
@api_view(['GET'])
def get_projects(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = get_users_projects_dashboard(request, serializer.data)
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


@scrum_master
@api_view(['POST'])
def delete_sprint(request):
    serializer = DeleteSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_sprint(serializer.data)
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

@scrum_master
@api_view(['POST'])
def create_sprint(request):
    serializer = CreateSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_create_sprint(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)

@did_sprint_end
@api_view(['GET'])
def get_sprints_backlog(request):
    if request.user.is_authenticated:
        serializer = GetSprintBacklogSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_sprint_backlog(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)

@scrum_master
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
@api_view(['GET'])
def get_sprint_info(request):
    if request.user.is_authenticated:
        serializer = GetSprintInfoSerializer(data=request.query_params)
        if serializer.is_valid():
            response = handle_get_sprint_info(request, serializer.data)
            return response
        else:
            return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
    else:
        return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)

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


@api_view(['POST'])
def add_sprint_review(request):
    serializer = SprintReviewAdditionSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_add_sprint_review(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


@api_view(['POST'])
def end_sprint(request):
    serializer = SprintEndSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_end_sprint(serializer.data)
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