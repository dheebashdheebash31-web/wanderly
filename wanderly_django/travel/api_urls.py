from django.urls import include, path

from . import api_views
from .admin_api import admin_router

order_list = api_views.OrderViewSet.as_view({"get": "list"})
order_detail = api_views.OrderViewSet.as_view({"get": "retrieve"})
order_checkout = api_views.OrderViewSet.as_view({"post": "checkout"})

urlpatterns = [
    # Staff-only management API used by the React admin panel (/admin-panel).
    path("admin/", include(admin_router.urls)),
    path("csrf/", api_views.CsrfCookieView.as_view(), name="api_csrf"),
    path("destinations/", api_views.DestinationListView.as_view(), name="api_destinations"),
    path("contact/", api_views.ContactMessageView.as_view(), name="api_contact"),
    path("newsletter/", api_views.NewsletterSubscribeView.as_view(), name="api_newsletter"),
    path("auth/signup/", api_views.SignupView.as_view(), name="api_signup"),
    path("auth/login/", api_views.LoginView.as_view(), name="api_login"),
    path("auth/logout/", api_views.LogoutView.as_view(), name="api_logout"),
    path("auth/user/", api_views.CurrentUserView.as_view(), name="api_current_user"),
    path("cart/", api_views.CartView.as_view(), name="api_cart"),
    path("cart/add/", api_views.CartAddItemView.as_view(), name="api_cart_add"),
    path("cart/items/<int:pk>/", api_views.CartItemDetailView.as_view(), name="api_cart_item_detail"),
    path("orders/", order_list, name="api_orders"),
    path("orders/checkout/", order_checkout, name="api_orders_checkout"),
    path("orders/<int:pk>/", order_detail, name="api_order_detail"),
]
