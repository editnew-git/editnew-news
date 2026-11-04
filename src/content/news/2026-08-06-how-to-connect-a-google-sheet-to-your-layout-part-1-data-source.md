---
title: "Configure and verify a Google Sheets Data Source"
subheadline: "Check connector settings, real field names and rows before relying on a Google Sheets connection."
date: "2026-08-06"
slug: "2026-08-06-how-to-connect-a-google-sheet-to-your-layout-part-1-data-source"
image: "/images/news/placeholder.jpg"
excerpt: "Identify the Google Docs connector fields and verify actual data separately from a successful Save."
tags: ["training", "layouts", "runsam", "google-sheets"]
draft: false
---

Configure **Data Source** first, then verify that the connected data can be read before formatting it in **Data Table**. Saving a connector's fields is not proof of a working connection.

## Prepare an approved source

Use a separate sheet containing only data approved for the intended publication. Put clear column headings in the first row and records beneath them. Record the exact tab to display.

Have the source owner confirm the publication method and access needed by the connector. Publishing content and granting editing access are different actions; do not broaden spreadsheet permissions by guesswork to fix a connection. Hiding a field in RunSAM does not restrict access to the underlying source.

## Identify the modules

1. Confirm the layout ID and open **gear tab → Module Manager**.
2. Inspect existing types and IDs before adding anything. If needed, choose **Data Source**, select **ADD MODULE**, and repeat for **Data Table**.
3. If you added modules, select the manager's **Save**, reopen it and verify the added types and IDs.
4. Close the manager after checking it, return with the **house tab**, and open the intended Data Source entry. Its label may be customized.

## Configure the Google connector

Select **Google Docs** in **Connector**. The matching form exposes:

| Field | What to confirm |
| --- | --- |
| Google Document ID String | The document identifier supported by this connector and publication method. |
| Google Sheet GID # | The exact numeric ID of the intended tab; do not assume every tab is 0. |
| Update Frequency (s) | The configured polling value in seconds; it is not a guaranteed end-to-end refresh time. |

For the tested Google Docs form, use the published identifier beginning with `2PACX-` from the owner's published Google Sheets link: it is the segment after `/spreadsheets/d/e/` and before `/pubhtml`. Enter that identifier in **Google Document ID String** and the intended tab's numeric GID in **Google Sheet GID #**. Select the main green **SAVE**, reopen Data Source and compare the saved values.

The normal editable spreadsheet ID is a different identifier. In the current test, that ID saved successfully but returned Google error-page content; the published identifier returned the expected synthetic rows. Check other connector versions against their own verified setup before replacing an existing identifier.

## Verify actual data

Open Data Table, select the intended **Source**, use its main **SAVE**, and reopen it. Inspect **Included Fields**: the names must match the source's real column headings. Then select the columns you need, save, and check actual nonempty rows in a fresh Preview against the intended sheet/tab.

![Data Table editor with sample label and value fields selected after saving the source](https://media.wwds.co/u/pressly-pr-en-20260808-001-452e698663582d8480dbcae6fd52e4f446d0b81212f82ce89a824e6ae535af43.webp)

[Open the example field-selection controls at full size](https://media.wwds.co/u/pressly-pr-en-20260808-001-452e698663582d8480dbcae6fd52e4f446d0b81212f82ce89a824e6ae535af43.webp).

Empty fields, HTML/CSS fragments or a Google error page appearing as field names are a failed data-loading checkpoint. Do not insert those strings into Text Block or treat them as a valid connection. Stop and verify the publication/identifier path with the source owner or support.

Data Source holds the connection settings; this form does not promise a visible table of rows. Data Table and field consumers provide separate read-back checkpoints. Physical-display delivery also requires its own verification.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the layout/module identity, field labels and a sanitized error. Keep private source addresses and access-bearing links out of public messages.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368