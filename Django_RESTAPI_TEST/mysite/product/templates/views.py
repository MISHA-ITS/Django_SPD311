from django.views.generic import TemplateView

class CategoryPageView(TemplateView):
    template_name = "categories.html"
