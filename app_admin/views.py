# from django.shortcuts import render

import json
import os
import traceback
import uuid
import time
import pytz
import requests

from datetime import timedelta, datetime
# from PIL import Image
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ImproperlyConfigured
from django.urls import reverse
from django.http import Http404, HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.views.generic import ListView, CreateView, UpdateView, TemplateView, DeleteView
from django.db import connection
# from multiprocessing import Process

# from core import const as constants
from core import models
from astra import settings
# from astra.mails import ClientNotificationMail
# from astra.utils import ErrorConnector
from .mixins import AdminContextMixin, WithHeader, WithParent, JSONResponseMixin


def admin_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(username=email, password=password)

        if user is not None:
            if user.is_active and user.type_of is constants.USER_TYPE_ADMIN:
                login(request, user)
                request.session['is_admin'] = 1  # this is for admins to view site
                return redirect(to=reverse('admin_index'))
            else:
                err_text = 'Пользователь не активен'
        else:
            err_text = 'Неверный логин или пароль'

        return render(request, 'login.html', context={
            "error": err_text,
        })

    else:
        ctx = {'already_logged': False}
        # TODO: uncomment this if admin login is turned on
        # if request.user.is_authenticated():
            # ctx['already_logged'] = True

        return render(request, 'login.html', context=ctx)


def admin_logout(request):
    logout(request)
    return redirect(to=reverse('login'))


class AdminIndex(TemplateView, AdminContextMixin, WithHeader):
    page_header = "Панель управления"
    template_name = 'index.html'
    current_page = 'main'


class JournalRecordList(ListView, AdminContextMixin, WithHeader):
    page_header = 'Журнал записей'
    context_object_name = 'journal_record'
    template_name = 'journal_record/list.html'
    queryset = models.JournalRecord.objects.all()
    ordering = 'time'
    current_page = 'journal_record'


class JournalRecordCreate(CreateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Добавить запись'
    parent_title = 'Журнал записей'
    current_page = 'journal_record'

    model = models.JournalRecord
    fields = ['id', 'master', 'service', 'time', 'client' ]
    context_object_name = 'JournalRecord'
    template_name = 'journal_record/create.html'

    def get_context_data(self, **kwargs):
        ctx = super(JournalRecordCreate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(JournalRecordCreate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(JournalRecordCreate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(JournalRecordCreate, self).form_invalid(form)

    def form_valid(self, form):
        JournalRecord = form.save(commit=False)

        return super(JournalRecordCreate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('journal_record_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class JournalRecordUpdate(UpdateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Обновить запись'
    parent_title = 'Журнал записей'
    current_page = 'journal_record'

    model = models.JournalRecord
    fields = ['id', 'master', 'service', 'time', 'client' ]
    context_object_name = 'journal_record'
    template_name = 'journal_record/update.html'

    def get_context_data(self, **kwargs):
        ctx = super(JournalRecordUpdate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(JournalRecordUpdate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(JournalRecordUpdate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(JournalRecordUpdate, self).form_invalid(form)

    def form_valid(self, form):
        JournalRecord = form.save(commit=False)

        return super(JournalRecordUpdate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('journal_record_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class JournalRecordRemove(DeleteView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Удалить запись'
    parent_title = 'Журнал записей'
    current_page = 'journal_record'
    fields = ['id', ]
    model = models.JournalRecord
    context_object_name = 'journal_record'
    template_name = 'journal_record/remove.html'

    def get_context_data(self, **kwargs):
        ctx = super(JournalRecordRemove, self).get_context_data(**kwargs)

        return ctx

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        self.object = models.JournalRecord.objects.get(pk=pk)
        res = super(JournalRecordRemove, self).post(request, *args, **kwargs)
        return res

    def get_parent_link(self):
        return reverse('journal_record_list')

    def get_success_url(self):
        return reverse('journal_record_list')


class MasterList(ListView, AdminContextMixin, WithHeader):
    page_header = 'Мастера'
    context_object_name = 'master'
    template_name = 'master/list.html'
    queryset = models.Master.objects.all()
    ordering = 'id'
    current_page = 'master'


class MasterCreate(CreateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Добавить мастера'
    parent_title = 'Мастера'
    current_page = 'master'

    model = models.Master
    fields = ['id', 'name', 'vacant_days', 'vacant_hours', 'photo_link', 'resume' ]
    context_object_name = 'Master'
    template_name = 'master/create.html'

    def get_context_data(self, **kwargs):
        ctx = super(MasterCreate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(MasterCreate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(MasterCreate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(MasterCreate, self).form_invalid(form)

    def form_valid(self, form):
        Master = form.save(commit=False)
        Master.save()

        return super(MasterCreate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('master_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class MasterUpdate(UpdateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Обновить мастера'
    parent_title = 'Мастера'
    current_page = 'master'

    model = models.Master
    fields = ['id', 'name', 'vacant_days', 'vacant_hours', 'photo_link', 'resume' ]
    context_object_name = 'master'
    template_name = 'master/update.html'

    def get_context_data(self, **kwargs):
        ctx = super(MasterUpdate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(MasterUpdate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(MasterUpdate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(MasterUpdate, self).form_invalid(form)

    def form_valid(self, form):
        Master = form.save(commit=False)
        Master.save()

        return super(MasterUpdate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('master_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class MasterRemove(DeleteView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Удалить мастера'
    parent_title = 'Мастера'
    current_page = 'master'
    fields = ['id', 'name', 'vacant_days', 'vacant_hours' ]
    model = models.Master
    context_object_name = 'master'
    template_name = 'master/remove.html'

    def get_context_data(self, **kwargs):
        ctx = super(MasterRemove, self).get_context_data(**kwargs)

        return ctx

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        self.object = models.Master.objects.get(pk=pk)
        res = super(MasterRemove, self).post(request, *args, **kwargs)
        return res

    def get_parent_link(self):
        return reverse('master_list')

    def get_success_url(self):
        return reverse('master_list')


class ServiceList(ListView, AdminContextMixin, WithHeader):
    page_header = 'Услуги'
    context_object_name = 'service'
    template_name = 'service/list.html'
    queryset = models.Service.objects.all()
    ordering = 'id'
    current_page = 'service'


class ServiceCreate(CreateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Добавить услугу'
    parent_title = 'Услуги'
    current_page = 'service'

    model = models.Service
    fields = ['id', 'name', 'price', 'time_elapsed', 'master' ]
    context_object_name = 'Service'
    template_name = 'service/create.html'

    def get_context_data(self, **kwargs):
        ctx = super(ServiceCreate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(ServiceCreate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(ServiceCreate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(ServiceCreate, self).form_invalid(form)

    def form_valid(self, form):
        Service = form.save(commit=False)
        Service.save()

        return super(ServiceCreate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('service_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class ServiceUpdate(UpdateView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Обновить услугу'
    parent_title = 'Услуги'
    current_page = 'service'

    model = models.Service
    fields = ['id', 'name', 'price', 'time_elapsed', 'master' ]
    context_object_name = 'service'
    template_name = 'service/update.html'

    def get_context_data(self, **kwargs):
        ctx = super(ServiceUpdate, self).get_context_data()
        ctx['form'] = self.get_form()

        return ctx

    def post(self, request, *args, **kwargs):

        return super(ServiceUpdate, self).post(request, *args, **kwargs)

    def get_form(self, form_class=None):
        form = super(ServiceUpdate, self).get_form()

        return form

    def form_invalid(self, form):

        return super(ServiceUpdate, self).form_invalid(form)

    def form_valid(self, form):
        Service = form.save(commit=False)
        Service.save()

        return super(ServiceUpdate, self).form_valid(form)

    def get_parent_link(self):
        return reverse('service_list')

    def get_success_url(self):
        return '../%s/' % self.object.id


class ServiceRemove(DeleteView, AdminContextMixin, WithHeader, WithParent):
    page_header = 'Удалить услугу'
    parent_title = 'Услуги'
    current_page = 'service'
    fields = ['id', 'name', ]
    model = models.Service
    context_object_name = 'service'
    template_name = 'service/remove.html'

    def get_context_data(self, **kwargs):
        ctx = super(ServiceRemove, self).get_context_data(**kwargs)

        return ctx

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk', None)
        self.object = models.Service.objects.get(pk=pk)
        res = super(ServiceRemove, self).post(request, *args, **kwargs)
        return res

    def get_parent_link(self):
        return reverse('service_list')

    def get_success_url(self):
        return reverse('service_list')












