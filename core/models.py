from django.db import models

# Create your models here.

class JournalRecord(models.Model):
	master = models.ForeignKey(to='Master')
	time_elapsed = 

	def save():

	def __str__(self):
		return self.name


class Master(models.Model):
	name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='ФИО мастера')
	vacant_days = models.CommaSeparatedIntegerField(default='6,7')
	vacant_hours = models.CharField(max_length=100, default='18-9, 13-14')

	def __check_time__(self, asked_time):
		checked = 0
		if asked_time != vacant_days: # temporary
			checked = 1
		return checked

	def __str__(self):
		return self.name


class Service(models.Model):
	name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='Наименование услуги')
	price = models.IntegerField(verbose_name='Цена')
	time_elapsed = models.IntegerField(verbose_name='Кол-во получасов')

	def __str__(self):
		return self.name

