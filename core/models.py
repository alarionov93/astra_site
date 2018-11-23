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
	phone = models.CharField(max_length=100, default='', blank=True, null=True)
	email = models.CharField(max_length=100, default='', blank=True, null=True)

	@property
	def duration(self):
		return self.service.time_elapsed

	@property
	def end_time(self):
		begin_time = datetime.strptime(self.time, '%Y-%m-%dT%H:%M:%S.%fZ')
		begin_hour = begin_time.hour
		delta_time = timedelta(minutes=self.duration*30)
		end_time = begin_time + delta_time

		return end_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

	def save(self, *args, **kwargs):
		print(self.service.time_elapsed, file=sys.stderr)
		if self.master.__check_time__(self.time, self.end_time):
			print('Created')
		else:
			raise ValueError('Приносим свои извинения, но это время недоступно для записи')


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
	photo_link = models.CharField(max_length=255, default='', blank=False, null=False)
	resume = models.CharField(max_length=255, default='', blank=False, null=False)
	
	# where to store occupied times and dates of masters????
	# TODO: create repo on github

	def time_table(self, asked_time):
		v_hours_intervals = [ _.strip() for _ in self.vacant_hours.split(',')]
		v_hours_splitted = [ (int(x)-1, int(y)) for x,y in [h.split('-') for h in v_hours_intervals] ]
		vh = []

		for h in range(0,48):
			for a,b in [(a*2, b*2) for a,b in v_hours_splitted]:
				if a > b:
					if 0 <= h < b or a < h < 48:
						vh += [h]
				else:
					if a < h < b:
						vh += [h]

		asked_date = datetime.strptime(asked_time, '%Y-%m-%dT%H:%M:%S.%fZ').date()
		# asked_hour = datetime.strptime(asked_time, '%Y-%m-%dT%H:%M:%S.%fZ').hour
		# asked_time_str = asked_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
		
		records = JournalRecord.objects.filter(master=self)
		for record in records:
			if datetime.strptime(record.time, '%Y-%m-%dT%H:%M:%S.%fZ').date() == asked_date:
				rec_begin_hour = int(datetime.strptime(record.time, '%Y-%m-%dT%H:%M:%S.%fZ').hour)*2
				rec_end_hour = int(datetime.strptime(record.end_time, '%Y-%m-%dT%H:%M:%S.%fZ').hour)*2
				hours_range = range(rec_begin_hour, rec_end_hour+1)
				print(hours_range, file=sys.stderr)
				vh += list(hours_range)

		# print(set(sorted(vh)))

		return set(sorted(vh))

	@property
	def working_time(self):

		return list(self.time_table() ^ set(range(0,48)))

	def __check_time__(self, asked_time, end_time):
		def _convert(_time):
			hour = _time.hour * 2
			if _time.minute == 30:
				hour += 1
			return hour

		asked = datetime.strptime(asked_time, '%Y-%m-%dT%H:%M:%S.%fZ')
		asked_end = datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S.%fZ')
		print(111111, asked.hour, file=sys.stderr)
		print(222222, asked.minute, file=sys.stderr)
		print(333333, asked_end, file=sys.stderr)
		# print(set(range(asked.hour, asked_end.hour)), self.time_table(asked_time), file = sys.stderr)
		asked_hour, asked_end_hour = _convert(asked), _convert(asked_end)
		return not (asked.weekday() in [int(x)-1 for x in self.vacant_days.split(',')]) and \
			not set(range(asked_hour, asked_end_hour)) & self.time_table(asked_time)

	def __str__(self):
		return self.name

	@property
	def services(self):

		return Service.objects.filter(master=self)

	class Meta:
		db_table = 'master'
		verbose_name = 'Мастер'
		verbose_name_plural = 'Мастера'


class Service(models.Model):
	name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='Наименование услуги')
	price = models.IntegerField(verbose_name='Цена')
	time_elapsed = models.IntegerField(verbose_name='Кол-во получасов')
	master = models.ForeignKey('Master', to_field='id', db_column='master_id', blank=True, null=True, unique=False,
                                verbose_name='Исполняющий мастер', on_delete=models.CASCADE)

	@property
	def time_in_minutes(self):
		return self.time_elapsed * 30

	def __str__(self):
		return self.name

	class Meta:
		db_table = 'service'
		verbose_name = 'Услуга'
		verbose_name_plural = 'Услуги'

