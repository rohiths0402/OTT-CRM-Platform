import django.db.models.deletion
from django.db import migrations, models
from django.db.models import Q

class Migration(migrations.Migration):
    dependencies = [("customers", "0001_initial"), ("subscribers", "0001_initial")]
    operations = [
        migrations.AlterField(model_name="subscriber", name="user", field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="subscriber_profile", to="authentication.user")),
        migrations.AddField(model_name="subscriber", name="customer", field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="subscriber_profile", to="customers.customer")),
        migrations.AddConstraint(model_name="subscriber", constraint=models.CheckConstraint(condition=(Q(user__isnull=False, customer__isnull=True) | Q(user__isnull=True, customer__isnull=False)), name="subscriber_one_identity_only")),
    ]
