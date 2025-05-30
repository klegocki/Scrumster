# Generated by Django 5.1.2 on 2025-04-12 00:00

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0017_remove_taskhistory_sprint_remove_task_sprint_and_more'),
        ('sprints', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=60)),
                ('description', models.TextField(blank=True, max_length=3000, null=True)),
                ('status', models.CharField(blank=True, max_length=60, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('estimated_hours', models.FloatField(blank=True, null=True)),
                ('git_link', models.CharField(blank=True, max_length=600, null=True)),
                ('approved', models.BooleanField(blank=True, default=False)),
                ('project_backlog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_backlog_tasks', to='projects.project')),
                ('sprint', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sprint_tasks', to='sprints.sprint')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_user_to_task', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TaskHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=60)),
                ('description', models.TextField(blank=True, max_length=3000, null=True)),
                ('status', models.CharField(blank=True, max_length=60, null=True)),
                ('changed_at', models.DateTimeField(auto_now_add=True)),
                ('estimated_hours', models.FloatField(blank=True, null=True)),
                ('git_link', models.CharField(blank=True, max_length=600, null=True)),
                ('approved', models.BooleanField(blank=True, default=False)),
                ('project_backlog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_backlog_history_tasks', to='projects.project')),
                ('sprint', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sprint_history_tasks', to='sprints.sprint')),
                ('task', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='project_backlog_tasks', to='tasks.task')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_user_to_task_history', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
