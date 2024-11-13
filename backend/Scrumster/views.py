from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from django.shortcuts import render
from django.http import JsonResponse

from tutorial.quickstart.serializers import GroupSerializer, UserSerializer

from django.views.generic import TemplateView
from react.mixins import ReactMixin

from backend.Scrumster.serializers import serialize_users


def users_list(request):
    users = User.objects.all()
    return JsonResponse(serialize_users(users), safe=False)


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