# Generated by Django 2.0.9 on 2018-11-22 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_master_resume'),
    ]

    operations = [
        migrations.AlterField(
            model_name='master',
            name='photo_link',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='master',
            name='resume',
            field=models.CharField(default='', max_length=255),
        ),
    ]
