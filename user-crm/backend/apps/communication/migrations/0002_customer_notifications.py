import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
from django.db.models import Q
class Migration(migrations.Migration):
    dependencies = [("communication", "0001_initial"), ("customers", "0001_initial"), migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.AlterField(model_name="notification", name="recipient", field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="notifications", to=settings.AUTH_USER_MODEL)),
        migrations.AddField(model_name="notification", name="customer", field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="notifications", to="customers.customer")),
        migrations.AddConstraint(model_name="notification", constraint=models.CheckConstraint(condition=(Q(recipient__isnull=False, customer__isnull=True) | Q(recipient__isnull=True, customer__isnull=False)), name="notification_one_recipient_only")),
    ]
