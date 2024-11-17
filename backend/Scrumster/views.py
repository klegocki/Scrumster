import json
import os
from http.client import HTTPResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from django.views.generic import TemplateView
from react.mixins import ReactMixin

from backend.Scrumster.serializers import serialize_users_credentials



def index(request):
    return render(request, 'index.html')

@api_view(['POST'])
def login_user(request):
    if isinstance(request.user, User):
        logout(request)
    credentials = request.data
    serializer_response = serialize_users_credentials(credentials)

    if serializer_response.status_code == 400:
        return serializer_response

    user = authenticate(request, username=credentials['username'], password=credentials['password'])

    if user is not None:
        login(request, user)
        return JsonResponse("OK.", status=200, safe=False)
    else:
        return JsonResponse({"message": "Nieprawidłowa nazwa użytkownika, lub hasło."}, status=400,)


@api_view(['POST'])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "Wylogowano pomyślnie."}, status=200)
    return JsonResponse({"message": "Użytkownik nie jest zalogowany."}, status=400)





class IndexView(ReactMixin, TemplateView):
    app_root = 'components/backend.jsx'
    def get_props_data(self):
        return {
            'title': 'Hello'
        }

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]