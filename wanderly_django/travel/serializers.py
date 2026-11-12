from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import (
    Cart,
    CartItem,
    ContactMessage,
    Destination,
    NewsletterSubscriber,
    Order,
    OrderItem,
    Profile,
)


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "slug", "name", "category", "description", "price", "price_amount"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["phone"]


class UserSerializer(serializers.ModelSerializer):
    """Represents the currently authenticated user, returned to React
    after login/signup and from the "who am I" endpoint."""

    phone = serializers.CharField(source="profile.phone", read_only=True, default="")

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "phone", "is_staff"]


class SignupSerializer(serializers.Serializer):
    fullname = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)
    password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Email already exists")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["fullname"],
        )
        Profile.objects.create(user=user, phone=validated_data["phone"])
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["email"]


class CartItemSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source="destination", write_only=True
    )
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "destination", "destination_id", "quantity", "subtotal"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "total_price", "total_items", "created_at"]
        read_only_fields = ["user", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "destination", "destination_name", "price", "quantity", "subtotal"]
        read_only_fields = ["destination_name", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "phone", "travel_date", "total_amount",
            "status", "created_at", "items",
        ]
        read_only_fields = ["user", "total_amount", "status", "created_at"]


class OrderCreateSerializer(serializers.Serializer):
    """Used to place an order (booking) from the current user's cart."""

    phone = serializers.CharField(max_length=15)
    travel_date = serializers.DateField()

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)

        if not cart.items.exists():
            raise serializers.ValidationError("Your cart is empty.")

        order = Order.objects.create(
            user=user,
            phone=validated_data["phone"],
            travel_date=validated_data["travel_date"],
            total_amount=cart.total_price,
        )
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                destination=cart_item.destination,
                destination_name=cart_item.destination.name,
                price=cart_item.destination.price_amount,
                quantity=cart_item.quantity,
            )
        cart.items.all().delete()
        return order
