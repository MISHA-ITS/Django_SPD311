from django.views import View
from django.shortcuts import render
from rest_framework import viewsets
from .models import Category
from .forms import CategoryForm
from .serializers import CategorySerializer
from django.views.generic import TemplateView
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from rest_framework import generics
from .serializers import UserCreateSerializer
import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
import os
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryPageView(TemplateView):
    template_name = 'product/categories.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context


class CategoryCreateView(View):
    def get(self, request):
        form = CategoryForm()
        return render(request, 'product/category_create.html', {'form': form})

    def post(self, request):
        form = CategoryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('category-page')
        else:
            return render(request, 'product/category_create.html', {
                'form': form,
                'success': False
            })

class GoogleLoginView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'access_token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        resp = requests.get(GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        if resp.status_code != 200:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        userinfo = resp.json()
        email = userinfo.get("email")
        name = userinfo.get("name")
        picture_url = userinfo.get("picture")

        from django.contrib.auth import get_user_model
        User = get_user_model()

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split('@')[0],
            "first_name": name,
            "isGoogle": True,
        })

        # Якщо користувач новий і є фото
        if created and picture_url:
            picture_resp = requests.get(picture_url)
            if picture_resp.status_code == 200:
                file_name = os.path.basename(urlparse(picture_url).path)
                file_name = file_name.split('?')[0]  # прибрати параметри
                file_name = file_name.rsplit('.', 1)[0] + ".jpg"  # можна .webp
                user.image.save(file_name, ContentFile(picture_resp.content), save=True)

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "firstname": user.first_name,
                "lastname": user.last_name,
                "image": user.image.url if user.image else None,
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer

class CheckUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "image": user.image.url if user.image else None,
        })
