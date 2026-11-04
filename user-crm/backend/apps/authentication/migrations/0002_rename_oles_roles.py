from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("authentication", "0001_initial")]
    operations = [
        migrations.RenameField(model_name="user", old_name="oles", new_name="roles")
    ]
