from rest_framework import serializers
from .models import CandidateProfile
from django.conf import settings

class CandidateProfileSerializer(serializers.ModelSerializer):
    resume = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = ['id', 'name', 'email', 'phone', 'resume', 'created_at']

    def get_resume(self, obj):
        request = self.context.get('request')
        if obj.resume:
            return request.build_absolute_uri(obj.resume.url)
        return None
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
