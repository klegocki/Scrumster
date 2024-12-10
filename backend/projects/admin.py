from django.contrib import admin

# Register your models here.
from .models import Project, DevelopmentTeam, Sprint, Task, TaskHistory

admin.site.register(Project)
admin.site.register(DevelopmentTeam)
admin.site.register(Sprint)
admin.site.register(Task)
admin.site.register(TaskHistory)
