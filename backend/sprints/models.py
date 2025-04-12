import uuid
from django.db import models
from projects.models import Project


class Sprint(models.Model):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.TextField(max_length=60, null=True, blank=True, default=None)
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
    manually_ended = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return f"Sprint ({self.start_date} - {self.end_date})"
