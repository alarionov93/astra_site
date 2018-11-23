# Generated by Django 2.0.9 on 2018-11-21 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20181031_1941'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='master',
            field=models.ForeignKey(blank=True, db_column='master_id', null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Master', verbose_name='Исполняющий мастер'),
        ),
    ]
