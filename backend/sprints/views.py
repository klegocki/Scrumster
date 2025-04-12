from django.http import JsonResponse
from rest_framework.decorators import api_view

from api.serializers import GetProjectSerializer, DeleteSprintSerializer, CreateSprintSerializer, \
    GetSprintBacklogSerializer, GetSprintInfoSerializer, SprintReviewAdditionSerializer, SprintEndSerializer, \
    DeleteTaskFromSprintSerializer
from .dao import handle_get_sprints, handle_remove_sprint, handle_create_sprint, handle_get_sprint_backlog, \
    handle_get_sprint_info, handle_add_sprint_review, handle_end_sprint, handle_remove_task_from_sprint
from scrumster.decorators import scrum_master, did_sprint_end



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


@scrum_master
@api_view(['POST'])
def delete_sprint(request):
    serializer = DeleteSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_sprint(serializer.data)
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
        return JsonResponse({"message": "Proszę wypełnić wszystkie wymagane pola."}, status=400)


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


@did_sprint_end
@api_view(['POST'])
def delete_task_from_sprint(request):
    serializer = DeleteTaskFromSprintSerializer(data=request.data)
    if serializer.is_valid():
        response = handle_remove_task_from_sprint(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)
