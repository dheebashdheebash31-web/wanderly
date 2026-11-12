from django.conf import settings
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.middleware.csrf import get_token
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem, ContactMessage, Destination, NewsletterSubscriber, Order
from .serializers import (
    CartItemSerializer,
    CartSerializer,
    ContactMessageSerializer,
    DestinationSerializer,
    LoginSerializer,
    NewsletterSubscriberSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    SignupSerializer,
    UserSerializer,
)

# Kept as a fallback so the site works even before any Destination rows
# exist in the database (e.g. right after `migrate`, before `loaddata`
# or admin entries have been added).
FALLBACK_DESTINATIONS = [
    {"id": "goa", "slug": "goa", "name": "Goa", "category": "beach", "description": "Beautiful beaches and nightlife", "price": "₹15000"},
    {"id": "manali", "slug": "manali", "name": "Manali", "category": "mountain", "description": "Snow mountains and adventure", "price": "₹18000"},
    {"id": "dubai", "slug": "dubai", "name": "Dubai", "category": "city", "description": "Luxury city experience", "price": "₹50000"},
    {"id": "kerala", "slug": "kerala", "name": "Kerala", "category": "nature", "description": "Backwaters and greenery", "price": "₹12000"},
]


class CsrfCookieView(APIView):
    """GET /api/csrf/ — call once on app load so the browser has a
    csrftoken cookie before any POST is attempted."""

    def get(self, request):
        return Response({"detail": get_token(request)})


class CurrentUserView(APIView):
    """GET /api/auth/user/ — tells React whether someone is logged in."""

    def get(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


class DestinationListView(generics.ListAPIView):
    serializer_class = DestinationSerializer

    def list(self, request, *args, **kwargs):
        queryset = Destination.objects.all()
        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        # DB has no destinations yet — serve the same fallback list the
        # original template-based views used.
        location = request.query_params.get("location") or request.query_params.get("destination")
        data = FALLBACK_DESTINATIONS
        if location:
            data = [d for d in data if location.lower() in d["name"].lower()]
        return Response(data)


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        # Signup stores email as the username, but accounts made with
        # `createsuperuser` may have a different username, so look the
        # account up by email and authenticate with its real username.
        account = User.objects.filter(email__iexact=email).first()
        username = account.username if account else email
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid login details"}, status=status.HTTP_401_UNAUTHORIZED)

        auth_login(request, user)
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    def post(self, request):
        auth_logout(request)
        return Response({"detail": "Logged out"})


class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            ContactMessage.objects.create(**serializer.validated_data)
            return Response({"detail": "Message sent successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterSubscribeView(APIView):
    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        subscriber_email = serializer.validated_data["email"]
        NewsletterSubscriber.objects.get_or_create(email=subscriber_email)

        try:
            send_mail(
                subject="Wanderly Newsletter",
                message=f"New Newsletter Subscriber\n\nEmail:\n{subscriber_email}",
                from_email=None,
                recipient_list=[settings.NEWSLETTER_NOTIFY_EMAIL],
            )
        except Exception:
            # Subscriber is already saved even if the notification email fails.
            pass

        return Response({"detail": "Subscribed successfully"}, status=status.HTTP_201_CREATED)


class CartView(APIView):
    """GET /api/cart/ — view the current user's cart."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    """POST /api/cart/add/ — {"destination_id": 1, "quantity": 2}"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        destination = serializer.validated_data["destination"]
        quantity = serializer.validated_data.get("quantity", 1)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, destination=destination)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    """
    PATCH  /api/cart/items/<id>/   -> {"quantity": 3}
    DELETE /api/cart/items/<id>/   -> remove item
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return CartItem.objects.filter(id=pk, cart__user=user).first()

    def patch(self, request, pk):
        cart_item = self.get_object(pk, request.user)
        if not cart_item:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        quantity = request.data.get("quantity")
        if quantity is None or int(quantity) < 1:
            return Response({"detail": "quantity must be >= 1"}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity = int(quantity)
        cart_item.save()
        return Response(CartSerializer(cart_item.cart).data)

    def delete(self, request, pk):
        cart_item = self.get_object(pk, request.user)
        if not cart_item:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        cart = cart_item.cart
        cart_item.delete()
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET  /api/orders/            -> list current user's bookings
    GET  /api/orders/<id>/       -> booking detail
    POST /api/orders/checkout/   -> {"phone": "...", "travel_date": "YYYY-MM-DD"} books the cart
    """

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
