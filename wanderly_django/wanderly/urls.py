from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("travel.api_urls")),
    # Legacy server-rendered pages, kept for reference/admin convenience,
    # now moved under /legacy/ so they don't collide with the React app
    # below, which owns "/" and every other non-API path.
    path("legacy/", include("travel.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# React app (single-server setup): `npm run build` in /frontend outputs
# straight into static/react/, and this catch-all serves its index.html
# for "/" and any client-side route (e.g. /about, /explore) so React
# Router can take over in the browser. Must stay LAST — anything above
# (admin/, api/, legacy/, static/media) is matched first.
urlpatterns += [
    re_path(r"^(?!static/|media/).*$", TemplateView.as_view(template_name="react_index.html")),
]
