from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Task, TaskHistory

@receiver(pre_save, sender=Task)
def save_task_history(sender, instance, **kwargs):
    if instance.pk:
        try:
            previous_instance = Task.objects.get(pk=instance.pk)
            if previous_instance.title != instance.title or \
               previous_instance.description != instance.description or \
               previous_instance.status != instance.status or \
               previous_instance.sprint != instance.sprint or \
               previous_instance.project_backlog != instance.project_backlog:
                TaskHistory.objects.create(
                    task=instance,
                    title=previous_instance.title,
                    description=previous_instance.description,
                    status=previous_instance.status,
                    sprint=previous_instance.sprint,
                    project_backlog=previous_instance.project_backlog,
                )
        except Task.DoesNotExist:
            pass
