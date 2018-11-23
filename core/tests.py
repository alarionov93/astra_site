from django.test import TestCase
from core.models import *
import sys
# Create your tests here.

class TestJournalRec(TestCase):
	def setUp(self):
		anton = Master.objects.create(name='Anton', vacant_days='6,7', vacant_hours='18-9, 13-15')
		shpilling1 = Service.objects.create(name='Шпилинг1', price=100500, time_elapsed=4)
		shpilling2 = Service.objects.create(name='Шпилинг2', price=1005, time_elapsed=2)
		rec0 = JournalRecord.objects.create(master=anton, service=shpilling1, time='2018-11-03T16:00:00.000Z', client='Lena')
		rec1 = JournalRecord.objects.create(master=anton, service=shpilling2, time='2018-11-03T12:00:00.000Z', client='Katya')
		rec3 = JournalRecord.objects.create(master=anton, service=shpilling1, time='2018-11-03T10:00:00.000Z', client='Petya')
		rec2 = JournalRecord.objects.create(master=anton, service=shpilling1, time='2018-11-03T14:00:00.000Z', client='Vasya')

	def test(self):
		print([jr.time for jr in JournalRecord.objects.all()], file=sys.stderr)

		return 0
        