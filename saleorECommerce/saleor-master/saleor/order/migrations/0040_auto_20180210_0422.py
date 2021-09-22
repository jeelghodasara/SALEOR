# Generated by Django 2.0.2 on 2018-02-10 10:22

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("order", "0039_auto_20180312_1203")]

    operations = [
        migrations.CreateModel(
            name="Fulfillment",
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
                (
                    "tracking_number",
                    models.CharField(blank=True, default="", max_length=255),
                ),
                (
                    "shipping_date",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="fulfillments",
                        to="order.Order",
                    ),
                ),
                (
                    "fulfillment_order",
                    models.PositiveIntegerField(editable=False, null=True),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("fulfilled", "Fulfilled"), ("canceled", "Canceled")],
                        default="fulfilled",
                        max_length=32,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FulfillmentLine",
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
                (
                    "order_line",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="order.OrderLine",
                    ),
                ),
                (
                    "quantity",
                    models.IntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(999),
                        ]
                    ),
                ),
                (
                    "fulfillment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="lines",
                        to="order.Fulfillment",
                    ),
                ),
            ],
        ),
        migrations.AlterModelOptions(
            name="order",
            options={
                "permissions": (
                    ("view_order", "Can view orders"),
                    ("edit_order", "Can edit orders"),
                )
            },
        ),
        migrations.AddField(
            model_name="orderline",
            name="order",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="lines",
                to="order.Order",
            ),
        ),
        migrations.AddField(
            model_name="orderline",
            name="quantity_fulfilled",
            field=models.IntegerField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(999),
                ],
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("unfulfilled", "Unfulfilled"),
                    ("partially fulfilled", "Partially fulfilled"),
                    ("fulfilled", "Fulfilled"),
                    ("canceled", "Canceled"),
                ],
                default="unfulfilled",
                max_length=32,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="shipping_method_name",
            field=models.CharField(
                blank=True, default=None, editable=False, max_length=255, null=True
            ),
        ),
        migrations.RemoveField(model_name="order", name="last_status_change"),
        migrations.AlterField(
            model_name="orderline",
            name="delivery_group",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="lines",
                to="order.DeliveryGroup",
            ),
        ),
    ]
