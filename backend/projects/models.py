import uuid
from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(null=False, blank=False, max_length=200)
    description = models.TextField(max_length=3000, null=True, blank=True)
    project_owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='project_owner'
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
