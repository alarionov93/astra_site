import json

# from .urls import patterns as admin_urls
import traceback

from astra import settings
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.utils.decorators import method_decorator
from django.views.generic.base import ContextMixin, View
# from app_admin import urls
from astra import const
import datetime

from astra.utils import ErrorConnector

CONST_LOGIN_REDIRECT_URL = '/astra_admin/login/' # TODO: replase with reverse(url)


# @method_decorator(login_required(login_url=CONST_LOGIN_REDIRECT_URL), name='dispatch')
class AdminAuthMixin(View):

    def dispatch(self, request, *args, **kwargs):
        # if request.user.type_of is not const.USER_TYPE_ADMIN:
        #     ctx = {
        #         'warning': '[WARNING] User must have admin rights! This is important issue, because NO ONE should NOT ever know route to admin without admin rights!',
        #     }
        #     data = {
        #         'process': settings.SITE_SETTINGS['site_name'],
        #         'status': 0,
        #         'message': 'Admin auth mixin: %s' % ctx.get('warning', ''),
        #         'user_id': request.user.id,
        #         'user_email': request.user.email,
        #     }
        #     fa_conn = ErrorConnector(data=data)
        #     fa_conn.send_data()

        #     raise Http404("User should have admin rights! This incident will be reported.")
        return super(AdminAuthMixin, self).dispatch(request, *args, **kwargs)


class WithParent(ContextMixin):
    parent_link = None
    parent_title = None
    model = None

    def get_parent_link(self):
        return self.parent_link

    def get_parent_title(self):
        if self.model and not self.parent_title:
            return self.model._meta.verbose_name_plural
        else:
            return self.parent_title


    def get_context_data(self, **kwargs):
        ctx = super(WithParent, self).get_context_data(**kwargs)
        if self.get_parent_link():
            ctx['parent_link'] = self.get_parent_link()
        else:
            raise ValueError("WithParent.parent_link must be defined!")

        if self.get_parent_title():
            ctx['parent_title'] = self.get_parent_title()
        else:
            raise ValueError("WithParent.parent_title must be defined!")

        return ctx


class WithHeader(ContextMixin):
    page_header = None

    def get_page_header(self):
        return self.page_header

    def get_context_data(self, **kwargs):
        ctx = super(WithHeader, self).get_context_data(**kwargs)
        if self.get_page_header():
            ctx['page_header'] = self.get_page_header()
        else:
            raise ValueError("WithHeader.page_header must be defined!")

        return ctx


class AdminContextMixin(ContextMixin, AdminAuthMixin):
    current_page = None
    current_group = None

    def get_context_data(self, **kwargs):
        ctx = super(AdminContextMixin, self).get_context_data(**kwargs)
        if self.current_page:
            ctx['current_page'] = self.current_page
        else:
            raise ValueError("AdminContextMixin.current_page must be defined!")

        ctx['current_group'] = self.current_group
        ctx['year'] = datetime.datetime.now().year
        ctx.update(settings.SITE_SETTINGS)

        return ctx


class CustomerContextMixin(ContextMixin):
    current_page = None
    current_group = None

    def get_context_data(self, **kwargs):
        ctx = super(CustomerContextMixin, self).get_context_data(**kwargs)
        if self.current_page:
            ctx['current_page'] = self.current_page
        else:
            raise ValueError("CustomerContextMixin.current_page must be defined!")

        ctx['current_group'] = self.current_group
        ctx['year'] = datetime.datetime.now().year
        ctx.update(settings.SITE_SETTINGS)

        return ctx


class JSONResponseMixin(object):
    def render_to_response(self, context):
        return self.get_json_response(self.convert_context_to_json(context))

    def get_json_response(self, content, **kwargs):
        return HttpResponse(content, content_type='application/json', **kwargs)

    def convert_context_to_json(self, context):
        return json.dumps(context)