# Generated by Django 2.0.9 on 2018-11-22 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20181122_1407'),
    ]

    operations = [
        migrations.AddField(
            model_name='master',
            name='photo_link',
            field=models.CharField(blank=True, default='', max_length=255, null=True),
        ),
    ]
