from django.contrib import admin

# Register your models here.
from .models import Project, DevelopmentTeam

admin.site.register(Project)
admin.site.register(DevelopmentTeam)

