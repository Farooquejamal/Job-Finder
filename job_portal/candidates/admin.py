from django.contrib import admin
from .models import CandidateProfile
# Register your models here.




@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ['name','phone','email','resume']
    search_fields = ('name', 'email', 'phone') 
