from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group, User
from rest_framework import serializers


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1','password2', 'email', 'first_name', 'last_name']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, required=True)
    email = serializers.CharField(max_length=50, required=True)
    password1 = serializers.CharField(max_length=30, required=True)
    password2 = serializers.CharField(max_length=30, required=True)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, required=True)
    password = serializers.CharField(max_length=30, required=True)

class DeleteProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)

class GetProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)

class LeaveProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)

class JoinProjectSerializer(serializers.Serializer):
    invite_code = serializers.CharField(max_length=10, required=True)

class CreateProjectSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(max_length=3000, allow_null=True, allow_blank=True)

class DeleteTaskSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    taskId = serializers.UUIDField(required=True)

class DeleteTaskFromSprintSerializer(serializers.Serializer):
    task_id = serializers.UUIDField(required=True)

class DeleteSprintSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    sprintId = serializers.UUIDField(required=True)

class CreateTaskSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    title = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(max_length=3000, allow_null=True, allow_blank=True)

class CreateSprintSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    daily_meet_link = serializers.CharField(max_length=3000, allow_null=True, allow_blank=True)
    title = serializers.CharField(max_length=60, allow_null=True, allow_blank=True)
    start_date = serializers.DateField(required=True)
    end_date = serializers.DateField(required=True)
    task_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=True,
    )

class GetSprintBacklogSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    sprint_id = serializers.UUIDField(required=True)

class GetSprintInfoSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    sprint_id = serializers.UUIDField(required=True)

class AssignDeveloperToTaskSerializer(serializers.Serializer):
    task_id = serializers.UUIDField(required=True)
    git_link = serializers.CharField(required=False, allow_blank=True)
    estimated_hours = serializers.FloatField(required=True)

class RevertTaskDeveloperSerializer(serializers.Serializer):
    task_id = serializers.UUIDField(required=True)

class SprintTaskCompletionSerializer(serializers.Serializer):
    task_id = serializers.UUIDField(required=True)

class SprintReviewAdditionSerializer(serializers.Serializer):
    sprint_id = serializers.UUIDField(required=True)
    sprint_review = serializers.CharField(max_length=3000)

class SprintEndSerializer(serializers.Serializer):
    sprint_id = serializers.UUIDField(required=True)

class SetUserProjectRoleSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    user_id = serializers.IntegerField(required=True)
    role =  serializers.CharField(max_length=50, required=True)

class DeleteUserProjectRoleSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    user_id = serializers.IntegerField(required=True)

class UserAlterUsernameSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30)

class UserAlterEmailSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=50)

class UserAlterPasswordSerializer(serializers.Serializer):
    password1 = serializers.CharField(max_length=30)
    password2 = serializers.CharField(max_length=30)

class UserAlterFirstAndLastNameSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30, allow_blank=True)
    last_name = serializers.CharField(max_length=30, allow_blank=True)

class GetUsersTasksSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    user_id = serializers.IntegerField(required=True)

class SearchUsersTasksSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=True)
    user_id = serializers.IntegerField(required=True)
    search = serializers.CharField(max_length=60, allow_null=True, allow_blank=True)

class AddTasksToExistingSprintSerializer(serializers.Serializer):
    sprint_id = serializers.UUIDField(required=True)
    project_id = serializers.UUIDField(required=True)
    task_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=True,
    )