# Generated by Django 5.1.2 on 2024-12-29 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_task_estimated_hours'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskhistory',
            name='estimated_hours',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
