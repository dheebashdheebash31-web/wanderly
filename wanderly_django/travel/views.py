from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import ContactForm, LoginForm, NewsletterForm, SignupForm
from .models import ContactMessage, Destination, NewsletterSubscriber, Profile

# ================= DESTINATIONS =================
# Kept as a fallback so the site works even before any Destination rows
# exist in the database (e.g. right after `migrate`, before `loaddata`
# or admin entries have been added).

FALLBACK_DESTINATIONS = {
    "goa": {"name": "Goa", "category": "Beach", "description": "Beautiful beaches and nightlife", "price": "₹15000"},
    "manali": {"name": "Manali", "category": "Mountain", "description": "Snow mountains and adventure", "price": "₹18000"},
    "dubai": {"name": "Dubai", "category": "City", "description": "Luxury city experience", "price": "₹50000"},
    "kerala": {"name": "Kerala", "category": "Nature", "description": "Backwaters and greenery", "price": "₹12000"},
}


def _destinations_context():
    destinations = Destination.objects.all()
    if destinations.exists():
        return destinations
    return FALLBACK_DESTINATIONS


# ================= HOME =================

def home(request):
    return render(request, "index.html", {"destinations": _destinations_context()})


# ================= ABOUT =================

def about(request):
    return render(request, "about.html")


# ================= EXPLORE =================

def explore(request):
    # Supports the nav's "Top Destinations" links (?destination=Goa) as
    # well as the homepage search box (?location=Goa).
    query = request.GET.get("location") or request.GET.get("destination") or ""
    return render(
        request,
        "explore.html",
        {"destinations": _destinations_context(), "destination": query},
    )


# ================= SEARCH =================
# Separate URL kept for parity with the original Flask app; it renders
# the same Explore page, filtered to the searched location.

def search(request):
    return explore(request)


# ================= CONTACT PAGE =================

def contact(request):
    return render(request, "contact.html")


# ================= CONTACT MESSAGE =================

def contact_message(request):
    if request.method != "POST":
        return redirect("contact")

    form = ContactForm(request.POST)
    if form.is_valid():
        ContactMessage.objects.create(**form.cleaned_data)
        messages.success(request, "Message sent successfully!")
    else:
        messages.error(request, "Please fill in every field with a valid value.")

    return redirect("contact")


# ================= SIGNUP =================

def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = User.objects.create_user(
                username=data["email"],
                email=data["email"],
                password=data["password"],
                first_name=data["fullname"],
            )
            Profile.objects.create(user=user, phone=data["phone"])
            messages.success(request, "Signup successful")
            return redirect("login")

        for error_list in form.errors.values():
            for error in error_list:
                messages.error(request, error)

    return render(request, "signup.html")


# ================= LOGIN =================

def login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            user = authenticate(request, username=email, password=password)
            if user is not None:
                auth_login(request, user)
                messages.success(request, "Login successful")
                return redirect("home")

        messages.error(request, "Invalid login details")

    return render(request, "login.html")


# ================= LOGOUT =================

def logout(request):
    auth_logout(request)
    messages.success(request, "Logged out")
    return redirect("home")


# ================= NEWSLETTER =================

def newsletter(request):
    if request.method != "POST":
        return redirect("home")

    form = NewsletterForm(request.POST)
    if not form.is_valid():
        messages.error(request, "Please enter a valid email address")
        return redirect(request.META.get("HTTP_REFERER", reverse("home")))

    subscriber_email = form.cleaned_data["email"]
    NewsletterSubscriber.objects.get_or_create(email=subscriber_email)

    try:
        send_mail(
            subject="Wanderly Newsletter",
            message=f"New Newsletter Subscriber\n\nEmail:\n{subscriber_email}",
            from_email=None,  # uses DEFAULT_FROM_EMAIL
            recipient_list=[settings.NEWSLETTER_NOTIFY_EMAIL],
        )
        messages.success(request, "Subscribed successfully")
    except Exception:
        # Subscriber is already saved even if the notification email fails.
        messages.success(request, "Subscribed successfully")

    return redirect(request.META.get("HTTP_REFERER", reverse("home")))


# ================= FAQ =================

def faq(request):
    return render(request, "faq.html")


# ================= PRIVACY =================

def privacy(request):
    return render(request, "privacy.html")


# ================= TERMS =================

def terms(request):
    return render(request, "terms.html")
