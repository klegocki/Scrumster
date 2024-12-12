from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from api.serializers import UserSerializer
from projects.dao import get_users_projects_dashboard


# Create your views here.
@api_view(['GET'])
def get_projects(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user)
        response = get_users_projects_dashboard(serializer.data)
        return response
    else:
        return JsonResponse({"message": "Wystąpił nieoczekiwany błąd."}, status=400)