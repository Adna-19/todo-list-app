from django.urls import path
from . import views

urlpatterns = [
    path('', views.todo_list, name='todo_list'),
    path('add/', views.add_todo, name='add_item'),
    path('<int:todo_id>/complete/', views.complete_todo, name='complete_todo'),
    path('delete/completed/', views.delete_completed, name='delete_completed'),
    path('delete/all/', views.delete_all, name='delete_all'),
]