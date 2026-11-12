import re

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models


class Profile(models.Model):
    """Extra signup info (phone number) that doesn't live on Django's
    built-in User model. Created automatically when a user signs up."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"Profile for {self.user.email}"


class Destination(models.Model):
    """Kept for parity with the original Flask app's `destinations` dict
    and so featured places can be managed from the Django admin."""

    CATEGORY_CHOICES = [
        ("beach", "Beach"),
        ("mountain", "Mountain"),
        ("city", "City"),
        ("nature", "Nature"),
        ("adventure", "Adventure"),
    ]

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)
    price = models.CharField(max_length=50, help_text="e.g. ₹15000")
    # Numeric mirror of `price` so cart/order totals can be computed. Kept
    # separate from `price` (display string) so the admin can go on typing
    # "₹15000" and this is auto-derived from it on save if left blank.
    price_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)]
    )

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.price_amount:
            digits = re.sub(r"[^\d.]", "", self.price or "")
            self.price_amount = digits or 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    """Stores messages submitted through the Contact page instead of just
    printing them to the console like the original Flask view did."""

    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} ({self.email})"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email


class Cart(models.Model):
    """One cart per logged-in user, holding destinations they're about to book."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        return sum((item.subtotal for item in self.items.all()), 0)

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, help_text="Number of travelers")

    class Meta:
        unique_together = ("cart", "destination")

    @property
    def subtotal(self):
        return self.destination.price_amount * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.destination.name}"


class Order(models.Model):
    """A confirmed booking, placed by checking out the current cart."""

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
    ]

    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    travel_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True)
    destination_name = models.CharField(max_length=100)  # snapshot in case destination changes later
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.destination_name}"
