from django.db import migrations


def seed_destinations(apps, schema_editor):
    Destination = apps.get_model("travel", "Destination")
    data = [
        {"slug": "goa", "name": "Goa", "category": "beach", "description": "Beautiful beaches and nightlife", "price": "₹15000"},
        {"slug": "manali", "name": "Manali", "category": "mountain", "description": "Snow mountains and adventure", "price": "₹18000"},
        {"slug": "dubai", "name": "Dubai", "category": "city", "description": "Luxury city experience", "price": "₹50000"},
        {"slug": "kerala", "name": "Kerala", "category": "nature", "description": "Backwaters and greenery", "price": "₹12000"},
    ]
    for entry in data:
        Destination.objects.get_or_create(slug=entry["slug"], defaults=entry)


def remove_destinations(apps, schema_editor):
    Destination = apps.get_model("travel", "Destination")
    Destination.objects.filter(
        slug__in=["goa", "manali", "dubai", "kerala"]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_destinations, remove_destinations),
    ]
