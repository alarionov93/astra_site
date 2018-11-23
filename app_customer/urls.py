from django.urls import path
from app_customer import views

urlpatterns = [
	path('', views.index, name='site_index')
]