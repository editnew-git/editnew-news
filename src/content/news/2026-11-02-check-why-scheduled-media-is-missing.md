---
title: "Check why scheduled media is missing"
date: "2026-11-02"
slug: "2026-11-02-check-why-scheduled-media-is-missing"
image: "/images/news/placeholder.jpg"
excerpt: "Review item identity, saved restrictions and timezone context before changing a schedule."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

Check the saved restrictions on the intended Media item before changing its schedule. The date fields, month dates and weekly grid are separate controls.

## When this applies

Use this guide for an individual item in the desktop **Media** editor. Layout-level priorities and emergency-alert scheduling require separate instructions.

## Before you begin

Confirm the layout and identify the item by its content. Record when it should appear, the intended time zone and when you observed the problem. Keep a record of the existing settings before making an authorized change.

## 1. Open the item's schedule

1. Open the intended layout's **Media** module. If you cannot find it, use [Find Media and Add Content in the layout editor](https://support.editnew.ca/news/2026-11-02-find-media-and-add-content-in-the-layout-editor/).
2. Open the **wrench dropdown on that content item** and select **Config/Schedule**. This is different from the layout's Settings gear.
3. In the matching editor, the item's **calendar icon** also opens its schedule. Its tooltip can show a status such as **No Schedule** or **Expired**; those words may appear only when you hover over the icon.
4. Confirm the **Item Label** and content before inspecting or editing the form.

![Media item menu with the Config/Schedule option](https://media.wwds.co/u/pressly-pr-en-20261102-005-0fab8e79ba9879e44b3030c6147821a17d3a61eb1881cd74a93489ca133999ec.webp)

The menu crop shows the Config/Schedule option. Open the intended item's wrench dropdown to reach this menu.

## 2. Check each restriction separately

The current desktop form contains these controls:

| Control | What to check |
|---|---|
| **Duration (seconds)** | The item's dwell time in the playlist. This is separate from its calendar start and end. |
| **Start Time/Date (UTC)** and **End Time/Date (UTC)** | The saved date and time bounds, including whether either field is blank. Check both the date and the time. |
| **Active Days of the Month** | The numbered calendar dates **1–31**. These are not weekdays. **Select All** and **Select None** apply to this group. |
| **WEEK DAY SCHEDULE — Device Local Time (Click / Drag)** | The **Sun–Sat** rows and hourly columns from **12a** through **11p**. The blue **Active** legend identifies enabled hour cells. **All** and **None** are controls for each row. |
| **Match Device Tags** | Any tag restriction that could limit which device shows the item. Record it before changing anything. |

![Media item schedule with UTC start and end fields, month dates 1 to 31, and the Device Local Time weekly grid](https://media.wwds.co/u/pressly-pr-en-20261102-005-e172b1ca4ef11a265a9b0500168d97b35464fecf0824f074befd70ed501ecece.webp)

[Open screenshot at full size](https://media.wwds.co/u/pressly-pr-en-20261102-005-e172b1ca4ef11a265a9b0500168d97b35464fecf0824f074befd70ed501ecece.webp)

The screenshot is an example of the controls. Its selected dates and hours are not a schedule to copy.

The date fields and weekly grid display different time-basis labels. Do not treat them as one device-local schedule or automatically apply the same conversion to both. Record the labels shown in your form and have your administrator or support confirm the relevant account and player configuration before converting or changing times. If your form differs from this description, send a cropped screenshot rather than guessing which control is equivalent.

Date display order can depend on the browser's locale. Read the displayed month, day and year carefully; do not copy dates from a demonstration screenshot.

## 3. Save and reopen an authorized correction

After an authorized edit, select the green **SAVE** at the top of the item form. Open the same item's **Config/Schedule** again and compare the saved values with the intended change. Check the date bounds, month dates, weekday grid and any tag restrictions as well as the field you edited.

Then reload **Preview** and observe several playlist transitions. Confirming that a value persisted does not establish when a physical screen will change. For timing problems, check the intended screen before, during and after the relevant period.

## Interpret the result

One restriction can exclude an item even when another matches. In a Media-only browser test, no eligible items produced an empty Media region. An unrestricted item rotated alongside another eligible item; it was not an exclusive fallback.

Do not clear all restrictions simply to make content appear. That changes the intended display window. A **No Schedule** tooltip or a successful Save is not proof of playback on the intended screen.

## When to contact support

Stop if the time basis is unclear or the saved schedule disagrees with observed playback. Send the layout and item identity, visible field labels, intended dates and times, applicable time zone, and before/during/after observations to [EditNew Support](https://support.editnew.ca) or [info@editnew.ca](mailto:info@editnew.ca).

Keep private account details out of screenshots. Preview behavior does not establish the physical player's cutoff time, daylight-saving behavior or layout priority.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368