import json
import string
import requests
import random
import core
import traceback
from astra import const
# from core import models
from astra import settings


def unique_temp_link_generator(size=6, chars=string.ascii_uppercase + string.digits):
        str = ''.join(random.choice(chars) for _ in range(size))

        return ''.join(['', str])

def get_admin_emails():

    return [u.email for u in core.models.User.objects.filter(type_of=const.USER_TYPE_ADMIN)]


def any(iterable):
    for l in iterable:
        if type(l) is str or type(l) is list:
            if len(l) > 0:
                return True
        elif type(l) is int:
            if l is not 0:
                return True
        elif type(l) is None:
            pass
        else:
            pass
    return False

def handle_exception(error):
    message = "[ERROR] Got exception: %s" % traceback.format_exception_only(type(error), error)
    print(message)
    return str(message)

class Connector():
    '''data = {
            'process': self.process,
            'status': self.status,
            'message': self.message
        }'''
    def __init__(self, data, srv_url=None):
        if srv_url is None:
            srv_url = settings.SITE_SETTINGS['web_panel_report_error_url']
        if not all([srv_url, data]):
            raise ValueError('One or more of required args not passed')
        else:
            self.srv_url = srv_url
            self.data = data

    def send_data(self):
        r = requests.post(self.srv_url, json=json.dumps(self.data))
        print(r.status_code)
        if r.status_code != 200:
            err_msg = '[ERROR] Error in %s service. Response status: %s.' % (self.srv_url, r.status_code)
            print(err_msg)


class ErrorConnector(Connector):

    # TODO: provide log level message!
    # TODO: define levels in const.py

    # data = {
    #     'process': 'Fresh App',         # required
    #     'status': 1,                    # required
    #     'message': 'Testing connector', # required
    #     ... additional parameters ...   # none required
    # }
    # conn = ErrorConnector(data=data, exception=None)
    # conn.send_data()

    def __init__(self, data, exception=None, srv_url=None):
        super(ErrorConnector, self).__init__(data=data, srv_url=srv_url)
        if not data:
            raise ValueError('One or more of required args not passed')
        else:
            message = self.data.get('message', None)
            event_group_id = self.data.get('event_group_id', None)
            if not message:
                raise ValueError('Message passing is required')
            if not event_group_id:
                self.data.update({
                    'event_group_id': settings.SITE_SETTINGS['event_group_id'],
                })
            if exception:
                self.exception = exception
                full_message = message + ' %s' % handle_exception(self.exception)
            else:
                full_message = message
            self.data.update({
                'message': full_message,
            })
