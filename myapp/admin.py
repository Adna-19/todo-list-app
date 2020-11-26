from django.contrib import admin
from .models import *

admin.site.register(Profile)

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'date_created')