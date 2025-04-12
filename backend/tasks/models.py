import uuid
from django.db import models
from projects.models import Project
from sprints.models import Sprint
from django.contrib.auth.models import User


class Task(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(null=False, blank=False, max_length=60)
    description = models.TextField(max_length=3000, null=True, blank=True)
    status = models.CharField(max_length=60, null=True, blank=True)
    sprint = models.ForeignKey(
        Sprint,
        on_delete=models.SET_NULL,
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
    estimated_hours = models.FloatField(null=True, blank=True)
    git_link = models.CharField(blank=True,null=True, max_length=600)
    approved = models.BooleanField(default=False, blank=True)

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
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assigned_user_to_task_history',
        null=True,
        blank=True
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    estimated_hours = models.FloatField(null=True, blank=True)
    git_link = models.CharField(blank=True, null=True, max_length=600)
    approved = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"History: {self.title} ({self.changed_at})"