from django.urls import path
from app_admin import views

urlpatterns = [
	path('', views.AdminIndex.as_view(), name='admin_index'),
	path('login/', views.admin_login, name='login'),
    path('logout/', views.admin_logout, name='logout'),
    
    path('journal_record/', views.JournalRecordList.as_view(), name='journal_record_list'),
    path('journal_record/add/', views.JournalRecordCreate.as_view(), name='journal_record_add'),
    path('journal_record/<int:pk>/', views.JournalRecordUpdate.as_view(), name='journal_record_update'),
    path('journal_record/remove/<int:pk>/', views.JournalRecordRemove.as_view(), name='journal_record_remove'),

    path('master/', views.MasterList.as_view(), name='master_list'),
    path('master/add/', views.MasterCreate.as_view(), name='master_add'),
    path('master/<int:pk>/', views.MasterUpdate.as_view(), name='master_update'),
    path('master/remove/<int:pk>/', views.MasterRemove.as_view(), name='master_remove'),

    path('service/', views.ServiceList.as_view(), name='service_list'),
    path('service/add/', views.ServiceCreate.as_view(), name='service_add'),
    path('service/<int:pk>/', views.ServiceUpdate.as_view(), name='service_update'),
    path('service/remove/<int:pk>/', views.ServiceRemove.as_view(), name='service_remove'),
]