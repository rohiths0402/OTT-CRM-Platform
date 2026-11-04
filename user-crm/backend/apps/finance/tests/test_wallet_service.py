from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.authentication.models import User
from apps.subscribers.models import Subscriber
from apps.finance.models import Wallet, WalletTransaction
from apps.finance.services.wallet import post_wallet_transaction


class WalletServiceTests(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            email="wallet@example.com",
            full_name="Wallet User",
            password="StrongPass123!",
        )
        subscriber = Subscriber.objects.create(user=user)
        self.wallet = Wallet.objects.create(subscriber=subscriber, balance="100.00")

    def test_debit_is_atomic_and_updates_ledger(self):
        tx = post_wallet_transaction(
            wallet_id=self.wallet.pk,
            kind=WalletTransaction.Kind.DEBIT,
            amount="25.00",
            reference="test-debit-1",
        )
        self.wallet.refresh_from_db()
        self.assertEqual(str(self.wallet.balance), "75.00")
        self.assertEqual(tx.balance_after, self.wallet.balance)

    def test_insufficient_funds_rejected(self):
        with self.assertRaises(ValidationError):
            post_wallet_transaction(
                wallet_id=self.wallet.pk,
                kind=WalletTransaction.Kind.DEBIT,
                amount="150.00",
                reference="test-debit-2",
            )
