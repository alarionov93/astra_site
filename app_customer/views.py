from django.shortcuts import render
from django.http import HttpResponse
from core import models
from datetime import datetime

import traceback, sys
# Create your views here.

def add_meta(ctx, page_header=None, current_page=None):
    ctx.update(settings.SITE_SETTINGS)
    # banners = models.Banner.objects.filter(enabled=True).order_by('-id')
    # ctx.update({'banners': banners})
    ctx.update({
        'page_header': page_header,
        'current_page': current_page
    })

    return ctx


def index(request):
    context = {}
    # open('/tmp/%s' % datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ'), 'w').write(request)
    masters = models.Master.objects.all()
    day = request.GET.get('day', datetime.now().strftime('%Y-%m-%d'))
    # date = datetime.strptime
    asked_time = '%sT00:00:00.000Z' % (day)
    if day:
        for m in masters:
            if datetime.strptime(asked_time, '%Y-%m-%dT%H:%M:%S.%fZ').weekday() not in [int(x)-1 for x in m.vacant_days.split(',')]:
                m.wh = [ str(a/2).replace(".5", ":30").replace(".0",":00") for a in list(m.time_table(asked_time) ^ set(range(0,48))) ]
            else:
                m.wh = []

    context.update({'masters': masters, 'day': day})
    if request.POST:
        # open('/tmp/astra.log', 'a').write('1\r\n')
        # print(request.POST, file=sys.stderr)
        master_id = request.POST.get('master_id', None)
        # date = request.POST.get('')
        time = request.POST.get('time', None)
        name = request.POST.get('name', None)
        phone = request.POST.get('phone', None)
        email = request.POST.get('email', None)
        service_id = request.POST.get('service_id', None)
        # open('/tmp/astra.log', 'a').write('%s %s %s %s %s %s \r\n' % (day, time, master_id, name, phone, service_id))
        context.update({
            'selected_master_id': master_id,
        })
        if all([time, master_id, name, phone, service_id]):
            try:
                # open('/tmp/astra.log', 'a').write('2\r\n')
                time_utc = '%sT%s:%s:00.000Z' % (day, time.split(':')[0], time.split(':')[1])
                # print(time_utc)
                # time_str = datetime.strptime(time, '%Y-%m-%dT%H:%M:%S.%fZ')
                master_obj = models.Master.objects.get(pk=master_id)
                service_obj = models.Service.objects.get(pk=service_id)
                # open('/tmp/astra.log', 'a').write('3\r\n')

                jr = models.JournalRecord.objects.create(master=master_obj, service=service_obj, time=time_utc, client=name, phone=phone, email=email)
                # jr.save()
                # open('/tmp/astra.log', 'a').write('4\r\n')
                context.update({
                    'success': 'Спасибо!',
                    'selected_master': master_obj.name,
                    'selected_master_id': master_obj.id,
                    'selected_time': '%s в %s' % (time_utc.split('T')[0], '%s:%s' % tuple(time_utc.split('T')[1].split('.')[0].split(':')[:2])),
                    'selected_service': service_obj.name
                })
            except ValueError as e:
                print('Error1')
                context.update({'error': '%s' % e})
                # open('/tmp/astra.log', 'a').write('err1_wrong_time\r\n')
            except Exception as e:
                print('Error2')
                context.update({'error': 'Ошибка, попробуйте еще раз через некоторое время'})
                # open('/tmp/astra.log', 'a').write('err2 %s\r\n' % e)
        else:
            # open('/tmp/astra.log', 'a').write('err3_form_not_filled\r\n')
            print('Error3')
            context.update({'error': 'Проверьте заполнение всех полей формы'})
        
        print(master_id)
        context.update({
            'selected_master_id': master_id,
        })


    return render(request, 'c_index.html', context=context)


