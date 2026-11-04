from django.contrib.auth.base_user import BaseUserManager


class CustomerManager(BaseUserManager):
    use_in_migrations = False

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email).lower()
        customer = self.model(email=email, **extra_fields)
        customer.set_password(password)
        customer.save(using=self._db)
        return customer

    def create_superuser(self, email, password=None, **extra_fields):
        raise NotImplementedError("OTT customers do not have Django staff superusers.")
