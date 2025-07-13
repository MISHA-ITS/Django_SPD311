from django.db import models
from django.contrib.auth.models import AbstractUser
from PIL import Image
import io
from django.core.files.base import ContentFile

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"
        
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    image = models.ImageField(upload_to='users/', blank=True)
    isGoogle = models.BooleanField(default=False)

    def __str__(self):
        return self.username
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)
            img = img.convert("RGB")
            output_io = io.BytesIO()
            img.save(output_io, format='WEBP', quality=80)

            new_image_name = self.image.name.rsplit('.', 1)[0] + '.webp'

            self.image.save(new_image_name, ContentFile(output_io.getvalue()), save=False)
            super().save(update_fields=['image'])