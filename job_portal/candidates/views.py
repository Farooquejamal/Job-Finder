from django.shortcuts import render,get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CandidateProfile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import CandidateProfileSerializer
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# Create your views here.


class RegisterView(APIView):
    def post(self,request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error':'Username already exists.'},status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error':'Email already exists.'},status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username,email=email,password=password)
        token,created = Token.objects.get_or_create(user=user)
        return Response({'token':token.key,'message':'User registered successfully.'},status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
            user = authenticate(username=username,password=password)
            if user is not None:
                token,created = Token.objects.get_or_create(user=user)
                print(f"Generated token:{token.key}")
                return Response({'token':token.key,'message':'Login Successful.'},status=status.HTTP_200_OK)
            return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error':'User with this email does not exist.'},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CandidateProfileView(APIView):
    def get(self,request):
        candidates = CandidateProfile.objects.all()
        serializer = CandidateProfileSerializer(candidates,many=True,context={'request':request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CandidateProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UploadResumeView(APIView):
    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        resume = request.FILES.get('resume')

        if not all([name, email, phone, resume]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)


        try:
            CandidateProfile.objects.create(
                name=name,
                email=email,
                phone=phone,
                resume=resume
            )
            return Response({"message": "Resume uploaded successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CandidateDashboardView(ListAPIView):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        try:
            candidate = CandidateProfile.objects.get(user=user)
            serializer = CandidateProfileSerializer(candidate)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except CandidateProfile.DoesNotExist:
            return Response({'eorror':'Candidate profile not found'},status=status.HTTP_404_NOT_FOUND)
        

class ResumeDownloadView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,candidate_id):
        try:
            candidate = get_object_or_404(CandidateProfile, id=candidate_id)
            resume = candidate.resume
            if not resume:
                return Response({'error':'Resume not found for this candidate'},status=status.HTTP_404_NOT_FOUND)
            response = HttpResponse(candidate.resume, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{candidate.name}_resume.pdf"'
            return response
    
        
        except CandidateProfile.DoesNotExist:
            return Response({"error":"candidate not found."},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error':str(e)}, status=500)