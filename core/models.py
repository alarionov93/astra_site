from django.db import models
from datetime import datetime, timedelta
import sys

# Create your models here.

class JournalRecord(models.Model):
	master = models.ForeignKey('Master', to_field='id', db_column='master_id', blank=False, null=False, unique=False,
                                verbose_name='Назначенный мастер', on_delete=models.CASCADE)
	service = models.ForeignKey('Service', to_field='id', db_column='service_id', blank=False, null=False, unique=False,
                                verbose_name='Услуга', on_delete=models.CASCADE)
	time = models.CharField(max_length=100, default='')
	client = models.CharField(max_length=100, default='')

	@property
	def duration(self):
		return self.service.time_elapsed

	def save(self, *args, **kwargs):
		print(self.service.time_elapsed, file=sys.stderr)
		if self.master.__check_time__(self.time):
			print('Created')
		else:
			raise Exception('Wrong time values!')


		super(JournalRecord, self).save(*args, **kwargs)

	def __str__(self):
		return self.name

	class Meta:
		db_table = 'journal_record'
		verbose_name = 'Запись'
		verbose_name_plural = 'Записи'


class Master(models.Model):
	name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='ФИО мастера')
	vacant_days = models.CharField(max_length=50, default='6,7')
	vacant_hours = models.CharField(max_length=100, default='18-9, 13-14')
	# where to store occupied times and dates of masters????
	# 

	@property
	def time_table(self):
		v_hours_intervals = [ _.strip() for _ in self.vacant_hours.split(',')]
		v_hours_splitted = [ (int(x)-1, int(y)) for x,y in [h.split('-') for h in v_hours_intervals] ]
		vh = []

		for h in range(0,24):
			for a,b in v_hours_splitted:
				if a > b:
					if 0 <= h < b or a < h < 24:
						vh += [h]
				else:
					if a < h < b:
						vh += [h]

		return vh

	def __check_time__(self, asked_time):
		# for test only !
		asked = datetime.strptime(asked_time, '%Y-%m-%dT%H:%M:%S.%fZ')

		if not (asked.weekday() in [int(x) for x in self.vacant_days.split(',')]) and \
			not (asked.hour) in self.time_table:
			print('Free', file=sys.stderr)
			return True

		return False

	def __str__(self):
		return self.name

	class Meta:
		db_table = 'master'
		verbose_name = 'Мастер'
		verbose_name_plural = 'Мастера'


class Service(models.Model):
	name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='Наименование услуги')
	price = models.IntegerField(verbose_name='Цена')
	time_elapsed = models.IntegerField(verbose_name='Кол-во получасов')

	def __str__(self):
		return self.name

	class Meta:
		db_table = 'service'
		verbose_name = 'Услуга'
		verbose_name_plural = 'Услуги'

