from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("explore/", views.explore, name="explore"),
    path("search/", views.search, name="search"),
    path("contact/", views.contact, name="contact"),
    path("contact-message/", views.contact_message, name="contact_message"),
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("newsletter/", views.newsletter, name="newsletter"),
    path("faq/", views.faq, name="faq"),
    path("privacy-policy/", views.privacy, name="privacy"),
    path("terms-and-conditions/", views.terms, name="terms"),
]
