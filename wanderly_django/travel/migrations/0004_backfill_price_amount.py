import re

from django.db import migrations


def backfill_price_amount(apps, schema_editor):
    Destination = apps.get_model("travel", "Destination")
    for destination in Destination.objects.all():
        if not destination.price_amount:
            digits = re.sub(r"[^\d.]", "", destination.price or "")
            destination.price_amount = digits or 0
            destination.save(update_fields=["price_amount"])


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0003_destination_price_amount_cart_order_orderitem_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_price_amount, noop),
    ]
