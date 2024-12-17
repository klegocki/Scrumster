from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, DeleteProjectSerializer, LeaveProjectSerializer
from projects.dao import get_users_projects_dashboard, handle_remove_project, handle_delete_project


# Create your views here.
@api_view(['GET'])
def get_projects(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = get_users_projects_dashboard(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)


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
