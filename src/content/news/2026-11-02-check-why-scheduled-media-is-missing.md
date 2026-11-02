---
title: "Check why scheduled media is missing"
date: "2026-11-02"
slug: "2026-11-02-check-why-scheduled-media-is-missing"
image: "/images/news/placeholder.jpg"
excerpt: "Review item identity, saved restrictions and timezone context before changing a schedule."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

Check the saved restrictions on the intended Media item before changing its schedule.

## When this applies

Use this guide for an individual Media item. Layout-level priorities and emergency-alert scheduling require separate instructions.

## Before you begin

Open the correct layout and identify the item by its content. Record the expected start and end dates, timezone and observed time. Preserve the current schedule before making changes.

## Inspect the schedule

1. Open the item's wrench menu and select **Config/Schedule** in the matching editor.
2. Inspect the start/end dates, active days of the month and weekday/hour selections separately.
3. Record the timezone labels shown by your form. Have support confirm how that form relates to the account and physical-device timezones before converting or changing times.
4. Check the intended date as well as the time. Media duration is the item's dwell time in a playlist, not the campaign's date window.
5. Reopen saved settings to confirm what persisted, then reload Preview and observe multiple playlist transitions.

## Interpret the result

An item may be excluded by one restriction even when another matches. In a Media-only browser test, no eligible items produced an empty Media region. An unrestricted item rotated alongside another eligible item; it was not an exclusive fallback.

## When to contact support

Stop if timezone semantics are unclear or the saved schedule disagrees with observed playback. Send the layout/item identity, field labels, dates, timezone and before/during/after observations. Do not remove schedule restrictions merely to make content appear: that changes the intended display window. Preview behavior does not establish the physical player's cutoff time.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca).

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368