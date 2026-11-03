---
title: "Check a video that will not autoplay in Preview"
date: "2026-11-02"
slug: "2026-11-02-check-a-video-that-will-not-autoplay-in-preview"
image: "/images/news/placeholder.jpg"
excerpt: "Distinguish browser playback restrictions from upload failure and physical-player behavior."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

When a saved video appears paused in browser Preview, check the browser session and the Media configuration before assuming the file is corrupt.

## Check the correct item

Confirm the layout ID, Media module and saved video. Check that its schedule allows it to play. A thumbnail shows that an image was generated; it does not prove the video advances.

Open the layout's **Preview** from the **house tab** in the outer editor, reload it and wait for the video's turn. Record any playback error and whether the frame remains paused.

## Test normal browser interaction

If Preview requests interaction, click once in a harmless area and observe the next video cycle. If playback then advances, record that it required interaction in that browser session. This is a diagnostic observation, not a guaranteed fix.

If the video should be silent, inspect the matching Media form's **Advanced → Mute Audio** control. Confirm its scope, save the intended setting, reopen it and test a fresh Preview. Muting a whole Media module can affect more than one item. Do not mute content that requires audio merely to make a test pass.

Watch advancing motion and, when required, listen for the intended audio. Do not infer autoplay from a single screenshot or from an enabled control alone.

## Browser Preview and physical displays

Browser autoplay behavior can depend on interaction and audio. A successful Preview workaround does not establish the physical player's configuration or guarantee the same behavior after a new session.

If playback still fails, contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the browser, exact error, file properties, saved audio settings and whether interaction changed the result. Do not disable browser security to work around the problem.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368