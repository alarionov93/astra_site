from django.test import TestCase
from core.models import *
import sys
# Create your tests here.

class TestJournalRec(TestCase):
	def setUp(self):
		anton = Master.objects.create(name='Anton', vacant_days='6,7', vacant_hours='18-9, 13-15')
		shpilling = Service.objects.create(name='Шпилинг', price=100500, time_elapsed=2)
		rec0 = JournalRecord.objects.create(master=anton, service=shpilling, time='2018-11-04T17:00:00.000Z', client='Lena')
		rec1 = JournalRecord.objects.create(master=anton, service=shpilling, time='2018-11-04T17:00:00.000Z', client='Katya')
		rec2 = JournalRecord.objects.create(master=anton, service=shpilling, time='2018-11-04T14:00:00.000Z', client='Vasya')

	def test(self):
		print(JournalRecord.objects.all(), file=sys.stderr)

		return 0
        