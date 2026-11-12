# Wanderly — React + Django REST Framework Edition

This is the Django "Wanderly" project split into two pieces:

- **`wanderly_django/`** — Django backend, now serving a JSON API under
  `/api/` (Django REST Framework) instead of rendering templates. The old
  template-based pages are still there and still work (handy for the
  admin, or as a fallback), but the primary UI is the React app.
- **`frontend/`** — a new Vite + React app that talks to that API and
  reproduces every page (Home, About, Explore, Contact, Login, Signup,
  FAQ, Privacy Policy, Terms). All the original CSS and images were
  reused as-is.

Auth uses Django's **session + CSRF** cookies (not tokens) — the browser
holds a `sessionid` cookie after login and a `csrftoken` cookie that
React reads and sends back as an `X-CSRFToken` header on POSTs, exactly
like a classic Django form would, just from JavaScript instead of HTML.

## Project layout

```
wanderly_django/     Django project + DRF API (unchanged app name: travel)
  travel/
    api_views.py      <- new: DRF views (signup, login, destinations, ...)
    api_urls.py        <- new: /api/... routes
    serializers.py      <- new
    views.py / urls.py  <- old template views, still present at /
frontend/            Vite + React app
  src/
    api/               fetch wrapper + endpoint helpers
    context/           AuthContext (session user), ToastContext (flash msgs)
    components/        Header, Footer, BootstrapNavbar, LegalPage
    pages/             Home, About, Explore, Contact, Login, Signup, Faq, Privacy, Terms
    styles/            the original CSS files, copied over unchanged
  public/images/       the original images, copied over unchanged
```

## Running it locally (Windows / PowerShell)

You have two options: **one server** (simplest — Django serves everything,
`fetch()` calls are same-origin) or **two servers** (better for active
frontend development — instant hot-reload on save).

### Installing Node.js / npm (one-time)

If `npm` isn't recognized in PowerShell, Node.js isn't installed yet — npm
ships with it, there's no separate install. Either:

```powershell
winget install OpenJS.NodeJS.LTS
```

or download the installer from https://nodejs.org (choose the LTS
version). **Close and reopen PowerShell** after installing so it picks up
the updated PATH, then confirm:

```powershell
node -v
npm -v
```

### Option A — one server (recommended for normal use)

Build the React app once, then only run Django. No CORS, no second
terminal, `fetch()` calls go to the same origin the page was loaded from.

```powershell
cd frontend
npm install
npm run build          # outputs into ..\wanderly_django\static\react
                        # and ..\wanderly_django\templates\react_index.html

cd ..\wanderly_django
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Open `http://127.0.0.1:8000` — that's it, one server, one port. Whenever
you change React source, re-run `npm run build` and refresh the browser.

The old server-rendered pages still exist too, now under `/legacy/`
(e.g. `http://127.0.0.1:8000/legacy/about/`).

### Option B — two servers (for active frontend development)

Better if you're editing React a lot — Vite hot-reloads on every save
instead of needing a rebuild each time.

```powershell
# Terminal 1
cd wanderly_django
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser --noinput --username admin --email admin@example.com
# (or set $env:DJANGO_SUPERUSER_PASSWORD first, then run createsuperuser normally)
python manage.py runserver 8000
```

```powershell
# Terminal 2
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. The `.env` file points it at
`http://127.0.0.1:8000` for the API; edit `VITE_API_BASE_URL` there if
your backend runs somewhere else. This mode relies on the CORS settings
in `wanderly_django/wanderly/settings.py`.

> **Important (from past experience with this project):** environment
> variables set with `$env:NAME = "value"` in PowerShell only last for
> that terminal session. If you close the terminal, re-set them (or put
> them in a `.env` file) before running `manage.py` again.

## How the pieces talk to each other

- On load, React calls `GET /api/csrf/` once to make sure the browser has
  a `csrftoken` cookie, then `GET /api/auth/user/` to check if a session
  is already logged in.
- Login/signup/logout/contact/newsletter all POST JSON to `/api/...` and
  rely on the session cookie + `X-CSRFToken` header for authentication —
  see `frontend/src/api/client.js`.
- CORS is configured in `wanderly_django/wanderly/settings.py` via
  `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS`, defaulting to
  `http://localhost:5173` and `http://127.0.0.1:5173`. Update those (and
  set `DJANGO_CROSS_SITE_COOKIES=True` with HTTPS) if you deploy the
  frontend on a different domain than the API.

## API endpoints

| Method | Path                    | Purpose                              |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/csrf/`             | Prime the CSRF cookie                 |
| GET    | `/api/destinations/`     | List destinations (`?location=`)      |
| POST   | `/api/contact/`          | Submit contact form                   |
| POST   | `/api/newsletter/`       | Subscribe to newsletter               |
| POST   | `/api/auth/signup/`      | Create an account                     |
| POST   | `/api/auth/login/`       | Log in (sets session cookie)          |
| POST   | `/api/auth/logout/`      | Log out                               |
| GET    | `/api/auth/user/`        | Current logged-in user, or 401        |

## What's the same as the Django-template version

- Same validation rules (email uniqueness, password match, min length 6)
- Same fallback destinations if the DB table is empty
- Same contact/newsletter behavior (saved to DB, email sent if
  `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD` are set, otherwise printed to
  the console)
- Same visual design — every page reuses its original CSS file 1:1

## Production notes

- Build the frontend for deployment with `npm run build` (outputs to
  `frontend/dist/`) and serve it from any static host or from Django's
  `staticfiles`/nginx.
- In production, set `DJANGO_CROSS_SITE_COOKIES=True` and serve the API
  over HTTPS if the frontend is on a different domain — browsers require
  `Secure` cookies for cross-site `SameSite=None` cookies to be sent.
- Don't forget `DJANGO_ALLOWED_HOSTS`, `DJANGO_SECRET_KEY`,
  `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` for your real domain.
