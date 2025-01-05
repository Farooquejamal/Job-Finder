from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class CandidateProfile(models.Model):
    name = models.CharField(max_length=100,default='Unknown')
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name
    

