# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-27 13:56
from __future__ import unicode_literals

from django.db import migrations


def link_to_sites(apps, schema_editor):
    SiteSettings = apps.get_model("site", "SiteSettings")
    Site = apps.get_model("sites", "Site")

    for setting in SiteSettings.objects.all():
        setting.site, dummy_created = Site.objects.get_or_create(
            domain=setting.domain, defaults={"name": setting.name}
        )
        setting.save()

    for site in Site.objects.filter(settings__isnull=True):
        SiteSettings.objects.get_or_create(
            site=site, defaults={"domain": site.domain, "name": site.name}
        )


class Migration(migrations.Migration):

    dependencies = [
        ("sites", "0002_alter_domain_unique"),
        ("site", "0006_auto_20171025_0454"),
    ]

    operations = [migrations.RunPython(link_to_sites, migrations.RunPython.noop)]
