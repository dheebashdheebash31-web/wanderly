# Wanderly — Django Edition

This is your original Flask "Wanderly" travel site, rebuilt as a Django
project. Same pages, same look, same URLs — but running on Django with a
real database, Django's authentication system, and the admin panel.

## What changed from the Flask version

- **Users**: signups now use Django's built-in `User` model with securely
  hashed passwords (SQLite database), instead of a plain-text `users.json`
  file. Login/logout use Django's session-based auth.
- **Signup form fix**: the original Flask view read `request.form["name"]`
  but the signup page's field was actually named `fullname` — that meant
  signing up would crash with a 400 error. This is now fixed and also
  properly validates that the two password fields match.
- **Search bug fix**: the Explore page's search used to inject a raw
  Python dict into a piece of JavaScript, which only "worked" by accident.
  It now passes the plain search text.
- **Contact messages** and **newsletter subscribers** are saved to the
  database (viewable in the admin) instead of just being printed to the
  console.
- **Email credentials**: the Gmail address/app-password that used to be
  hard-coded in `app.py` are now read from environment variables (see
  below). Without them, emails are simply printed to the console — the
  site still works fine for local development.
- **Flash messages** → Django's built-in messages framework (same visual
  effect, different plumbing).
- Added a Django admin site (`/admin/`) so you can manage destinations,
  contact messages and newsletter subscribers without touching code.

## Project layout

```
wanderly_django/
├── manage.py
├── requirements.txt
├── wanderly/          # project settings, root urls.py
├── travel/            # the app: views.py, urls.py, models.py, forms.py, admin.py
├── templates/          # your original HTML pages, converted to Django template syntax
└── static/             # your original CSS and images, unchanged
```

## Setup

```bash
# 1. Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 2. Install Django
pip install -r requirements.txt

# 3. Create the database tables (and seed the 4 sample destinations)
python manage.py migrate

# 4. Create an admin account
python manage.py createsuperuser

# 5. Run the dev server
python manage.py runserver
```

Then visit **http://127.0.0.1:8000/** for the site and
**http://127.0.0.1:8000/admin/** for the admin panel.

> Note: I wasn't able to actually run `pip install` or the dev server in
> this sandbox (no internet/package access here), so please run the steps
> above yourself and let me know if anything errors — I'll fix it fast.

## Environment variables (optional)

By default `DEBUG=True` and a placeholder `SECRET_KEY` are used, which is
fine for local development. Before deploying anywhere public, set:

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | A long random string |
| `DJANGO_DEBUG` | `False` in production |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated list, e.g. `example.com,www.example.com` |
| `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | Gmail address + app password, to actually send newsletter emails |
| `NEWSLETTER_NOTIFY_EMAIL` | Where newsletter signup notifications go (defaults to `EMAIL_HOST_USER`) |

## Routes

| Page | URL |
|---|---|
| Home | `/` |
| About | `/about/` |
| Explore | `/explore/` |
| Search | `/search/?location=...` |
| Contact | `/contact/` |
| Signup | `/signup/` |
| Login | `/login/` |
| Logout | `/logout/` |
| FAQ | `/faq/` |
| Privacy Policy | `/privacy-policy/` |
| Terms & Conditions | `/terms-and-conditions/` |
| Admin | `/admin/` |
