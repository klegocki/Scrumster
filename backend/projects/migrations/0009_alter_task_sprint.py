# Generated by Django 5.1.2 on 2025-01-04 04:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0008_alter_task_title_alter_taskhistory_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='sprint',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sprint_tasks', to='projects.sprint'),
        ),
    ]
