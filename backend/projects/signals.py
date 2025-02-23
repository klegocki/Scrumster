from django.db.models.signals import pre_save
from django.contrib.auth.models import User
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
               previous_instance.project_backlog != instance.project_backlog or \
               previous_instance.estimated_hours != instance.estimated_hours or \
               previous_instance.user != instance.user or \
               previous_instance.git_link != instance.git_link:

                TaskHistory.objects.create(
                    task=instance,
                    title=previous_instance.title,
                    description=previous_instance.description,
                    status=previous_instance.status,
                    sprint=previous_instance.sprint,
                    project_backlog=previous_instance.project_backlog,
                    estimated_hours=previous_instance.estimated_hours,
                    user=previous_instance.user,
                    git_link=previous_instance.git_link,
                )
        except Task.DoesNotExist:
            print(f"Task with pk={instance.pk} does not exist.")
        except Exception as e:
            print(f"Unexpected exception: {e}")
