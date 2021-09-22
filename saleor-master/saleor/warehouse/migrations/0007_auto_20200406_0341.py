# Generated by Django 3.0.4 on 2020-04-06 08:41

import django.db.models.deletion
from django.db import migrations, models

UNFULFILLED = "unfulfilled"
PARTIALLY_FULFILLED = "partially fulfilled"


def create_allocation(
    product_variant, warehouse, order_line, quantity_allocated, Allocation
):
    stock = product_variant.stocks.get(warehouse=warehouse)
    Allocation.objects.create(
        order_line=order_line, stock=stock, quantity_allocated=quantity_allocated
    )


def create_allocations(apps, schema_editor):
    Allocation = apps.get_model("warehouse", "Allocation")
    OrderLine = apps.get_model("order", "OrderLine")
    Warehouse = apps.get_model("warehouse", "Warehouse")
    for warehouse in Warehouse.objects.iterator():
        shipping_zone = warehouse.shipping_zones.first()
        if not shipping_zone:
            continue
        shipping_zone_pk = shipping_zone.pk
        for order_line in OrderLine.objects.filter(
            order__shipping_method__shipping_zone__pk=shipping_zone_pk,
            order__status__in=[UNFULFILLED, PARTIALLY_FULFILLED],
        ).iterator():
            quantity_unfulfilled = order_line.quantity - order_line.quantity_fulfilled
            if quantity_unfulfilled > 0 and order_line.variant:
                create_allocation(
                    order_line.variant,
                    warehouse,
                    order_line,
                    quantity_unfulfilled,
                    Allocation,
                )


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0081_auto_20200406_0456"),
        ("warehouse", "0006_auto_20200228_0519"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="stock",
            options={"ordering": ("pk",)},
        ),
        migrations.CreateModel(
            name="Allocation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("quantity_allocated", models.PositiveIntegerField(default=0)),
                (
                    "order_line",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="allocations",
                        to="order.OrderLine",
                    ),
                ),
                (
                    "stock",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="allocations",
                        to="warehouse.Stock",
                    ),
                ),
            ],
            options={
                "ordering": ("pk",),
                "unique_together": {("order_line", "stock")},
            },
        ),
        migrations.RunPython(create_allocations),
        migrations.RemoveField(
            model_name="stock",
            name="quantity_allocated",
        ),
    ]
