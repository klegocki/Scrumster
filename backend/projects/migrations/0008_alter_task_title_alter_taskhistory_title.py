# Generated by Django 5.1.2 on 2025-01-03 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_taskhistory_estimated_hours'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='title',
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name='taskhistory',
            name='title',
            field=models.CharField(max_length=60),
        ),
    ]
