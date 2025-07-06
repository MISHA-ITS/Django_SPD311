from django.views import View
from django.shortcuts import render
from rest_framework import viewsets
from .models import Category
from .forms import CategoryForm
from .serializers import CategorySerializer
from django.views.generic import TemplateView
from django.shortcuts import redirect

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
