from django.contrib import admin

# Register your models here.
from .models import Task, TaskHistory

admin.site.register(Task)
admin.site.register(TaskHistory)
