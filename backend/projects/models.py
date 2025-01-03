import uuid
from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Project(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(null=False, blank=False, max_length=200)
    description = models.TextField(max_length=3000, null=True, blank=True)
    project_owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='owned_projects'
    )
    project_users = models.ManyToManyField(
        User,
        blank=True,
        related_name='project_users'
    )
    product_owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='product_owner_projects'
    )
    scrum_master = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='scrum_master_projects'
    )
    invite_code = models.CharField(max_length=10, unique=True, null=False)


    def __str__(self):
        return self.title

class DevelopmentTeam(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='development_team',
        null=True,
        blank=True
    )
    role = models.CharField(max_length=50, null=True, blank=True)
    project = models.ForeignKey(
        'Project',
        on_delete=models.CASCADE,
        related_name='development_team_project',
        null=True,
        blank=True
    )
    def __str__(self):
        return self.project.title + " " + self.role


class Sprint(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    start_date = models.DateField( null=False, blank=False)
    end_date = models.DateField( null=False, blank=False)
    daily_meet_link = models.CharField(max_length=500, null=True, blank=True)
    sprint_review = models.TextField(max_length=5000, null=True, blank=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="project_sprint"
    )

    def __str__(self):
        return f"Sprint ({self.start_date} - {self.end_date})"

class Task(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(null=False, blank=False, max_length=60)
    description = models.TextField(max_length=3000, null=True, blank=True)
    status = models.CharField(max_length=60, null=True, blank=True)
    sprint = models.ForeignKey(
        Sprint,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="sprint_tasks"
    )
    project_backlog = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="project_backlog_tasks"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assigned_user_to_task',
        null=True,
        blank=True
    )
    created = models.DateTimeField(auto_now_add=True)
    estimated_hours = models.IntegerField(null=True, blank=True)


    def __str__(self):
        return self.title

class TaskHistory(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=True,
        related_name="project_backlog_tasks"
    )
    title = models.CharField(max_length=60)
    description = models.TextField(max_length=3000, null=True, blank=True)
    status = models.CharField(max_length=60, null=True, blank=True)
    sprint = models.ForeignKey(
        Sprint,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="sprint_history_tasks"
    )
    project_backlog = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="project_backlog_history_tasks"
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    estimated_hours = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"History: {self.title} ({self.changed_at})"