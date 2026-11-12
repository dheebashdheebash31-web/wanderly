"""Staff-only REST API behind the React admin panel (/admin-panel).

Every viewset uses IsAdminUser, so a normal logged-in user (or an
anonymous visitor) calling these URLs directly gets 401/403 — the React
route guard is only a convenience, this is the real protection.

Note on passwords: Django stores only one-way hashes, so real passwords
can never be shown. Admins can set a NEW password for a user instead.
"""

from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from .models import (
    ContactMessage,
    Destination,
    NewsletterSubscriber,
    Order,
    OrderItem,
    Profile,
)


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=30)
    orders_count = serializers.SerializerMethodField()
    orders = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name", "is_active",
            "is_staff", "date_joined", "phone", "orders_count", "orders", "password",
        ]
        read_only_fields = ["date_joined"]

    def get_orders_count(self, obj):
        return obj.orders.count()

    def get_orders(self, obj):
        return [
            {
                "id": o.id,
                "status": o.status,
                "total_amount": str(o.total_amount),
                "travel_date": o.travel_date.isoformat(),
            }
            for o in obj.orders.all()
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile = getattr(instance, "profile", None)
        data["phone"] = profile.phone if profile else ""
        return data

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        password = validated_data.pop("password", "")
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        Profile.objects.create(user=user, phone=phone)
        return user

    def update(self, instance, validated_data):
        phone = validated_data.pop("phone", None)
        password = validated_data.pop("password", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if password:
            instance.set_password(password)  # stored hashed, never readable
        instance.save()
        if phone is not None:
            profile, _ = Profile.objects.update_or_create(user=instance, defaults={"phone": phone})
            instance.profile = profile  # refresh the cached relation for the response
        return instance


class AdminOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "destination_name", "price", "quantity"]


class AdminOrderSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.CharField(source="user.email", read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user_name", "user_email", "phone", "travel_date",
            "total_amount", "status", "created_at", "items",
        ]
        read_only_fields = ["total_amount", "created_at"]

    def get_user_name(self, obj):
        return obj.user.first_name or obj.user.username


class AdminDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "slug", "name", "category", "description", "price", "price_amount"]


class AdminMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]


class AdminSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["id", "email", "subscribed_at"]


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = (
        User.objects.select_related("profile")
        .prefetch_related("orders")
        .order_by("-date_joined")
    )
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        if self.get_object() == request.user:
            return Response({"detail": "You can't delete your own account."}, status=400)
        return super().destroy(request, *args, **kwargs)

    def perform_update(self, serializer):
        # Stop an admin from locking themselves out by accident.
        if serializer.instance == self.request.user:
            data = serializer.validated_data
            if data.get("is_active") is False or data.get("is_staff") is False:
                raise serializers.ValidationError(
                    "You can't deactivate or remove admin rights from your own account."
                )
        serializer.save()


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("user").prefetch_related("items")
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "patch", "delete", "head", "options"]


class AdminDestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = AdminDestinationSerializer
    permission_classes = [IsAdminUser]


class AdminMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = AdminMessageSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "delete", "head", "options"]


class AdminSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = AdminSubscriberSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "delete", "head", "options"]


admin_router = DefaultRouter()
admin_router.register("users", AdminUserViewSet, basename="admin-users")
admin_router.register("orders", AdminOrderViewSet, basename="admin-orders")
admin_router.register("destinations", AdminDestinationViewSet, basename="admin-destinations")
admin_router.register("messages", AdminMessageViewSet, basename="admin-messages")
admin_router.register("subscribers", AdminSubscriberViewSet, basename="admin-subscribers")
