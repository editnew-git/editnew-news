---
title: "Check why Preview still shows old content"
date: "2026-11-02"
slug: "2026-11-02-check-why-preview-still-shows-old-content"
image: "/images/news/placeholder.jpg"
excerpt: "Determine whether an update failed to save or an already-open Preview is showing an older revision."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

Compare the saved editor, a fresh layout Preview and the physical display separately to find where an update stopped.

## Check the saved content first

1. Confirm the layout ID. A copy has a different ID even if its name is similar.
2. Reopen the affected item or module and inspect the actual saved content.
3. For Media Text/HTML and Text Block source edits, use source-dialog **Save** when applicable, then the editor's main **SAVE**.
4. For an image added through **Content → Upload Image(s)**, check for the item after the upload dialog's green **Save**. That upload flow does not require the Text/HTML two-save sequence.

## Open the correct Preview

Select the **house tab at the top of the right sidebar**, then **Preview** in the outer layout editor. Reload the opened Preview normally. Do not confuse it with the Preview button inside a rich-text toolbar.

Watch for the intended playlist item's turn, and compare its content with the reopened editor.

| Observation | Next check |
| --- | --- |
| Reopened editor still contains the old content | Verify layout/item identity, finish the correct Save and record any error. |
| Saved editor and reloaded Preview are correct | The earlier view was stale; this does not identify the cause. |
| Saved item never appears in Preview | Inspect order, duration and eligibility settings, including the form's timezone labels. |
| Preview is correct but the physical display differs | Record the assigned layout, device status, observation time and screenshot age for support. |

Do not repeatedly Republish or change global refresh settings as a guessed remedy. Republish does not save an unfinished draft, and this procedure promises no fixed delivery delay.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the layout ID, Save time and timezone, expected change and each observed result.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368