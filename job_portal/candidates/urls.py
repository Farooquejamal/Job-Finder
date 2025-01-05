from django.urls import path
from .views import CandidateProfileView,RegisterView,LoginView,UploadResumeView,UserDetailsView,ResumeDownloadView

urlpatterns = [
    path('candidates/',CandidateProfileView.as_view(),name='candidate-profiles'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('user-details/', UserDetailsView.as_view(), name='user-details'),
    path('download-resume/<int:candidate_id>/', ResumeDownloadView.as_view(), name='download_resume'),
]
