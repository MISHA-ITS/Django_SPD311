"""
URL configuration for mystore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from product.views import CategoryViewSet
from product.views import CategoryPageView
from product.views import CategoryCreateView
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from product.views import GoogleLoginView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from product.views import UserCreateView
from product.views import CheckUserView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('categories/', CategoryPageView.as_view(), name='category-page'),
    path('categories/create/', CategoryCreateView.as_view(), name='category-create'),
    path('api/google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', UserCreateView.as_view(), name='user-register'),
    path("api/check-user/", CheckUserView.as_view(), name="check-user"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)