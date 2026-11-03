from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [migrations.CreateModel(name="Customer", fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("password", models.CharField(max_length=128, verbose_name="password")),
        ("last_login", models.DateTimeField(blank=True, null=True, verbose_name="last login")),
        ("email", models.EmailField(max_length=254, unique=True)),
        ("full_name", models.CharField(max_length=150)),
        ("phone", models.CharField(blank=True, max_length=20)),
        ("is_active", models.BooleanField(default=True)),
        ("email_verified", models.BooleanField(default=False)),
        ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
        ("updated_at", models.DateTimeField(auto_now=True)),
    ], options={"ordering": ["-created_at"]})]
