---
title: "Check a data-source field in Text Block"
subheadline: "Display a specific value from a connected Google Sheet in an S.A.M. layout."
date: "2026-08-11"
slug: "2026-08-11-how-to-reference-a-single-google-sheet-item-using-a-textblock"
image: "/images/news/placeholder.jpg"
excerpt: "Identify the source behind Insert Field and verify the saved reference and displayed value."
tags: ["training", "layouts", "runsam"]
draft: false
---

A Text Block can expose field choices from a Data Source. Verify that the connector loads the intended data before inserting a field into the message.

## Identify the source and Text Block

1. Confirm the layout ID and the working Data Source's type and ID. Check its real column names and source rows through the connection procedure first.
2. Open **gear tab → Module Manager** and inspect existing Text Block modules. If a new one is needed, choose **Text Block**, select **ADD MODULE**, then the manager's **Save**. Reopen the manager and record its type and ID.
3. Return with the **house tab** and open that Text Block entry. Preserve any existing text before editing.

## Inspect the field selector

The selector above the text editor is associated with a Data Source and its display label. It is not always named **GS Connector**; it can show a custom name or **Set Label**. Confirm which Data Source it represents.

Click where the value belongs in the text editor, choose the intended available field and select **Insert Field**. Confirm both its source record and field name: an option can include a module ID, row number, field name and current value, such as `6_1_value=>100`. That is an example, not an identifier to type into another layout.

If options are empty or contain HTML, CSS or a Google error page, stop: those are not valid field choices. Resolve the connector first.

![Text Block editor with a sample spreadsheet field selector, Insert Field, Source code icon and main SAVE](https://media.wwds.co/u/pressly-pr-en-20260811-001-8ec3b3023d7445218317bbeebb78dc2ef32ea0e5032772afe273640bc3fb4efa.webp)

[Open the field-insertion controls at full size](https://media.wwds.co/u/pressly-pr-en-20260811-001-8ec3b3023d7445218317bbeebb78dc2ef32ea0e5032772afe273640bc3fb4efa.webp). The selected field and message are examples.

## Save and verify the value

Inspect what Insert Field places in the editor. Preserve the generated field reference rather than replacing it with a guessed identifier. If you edit HTML through **Source code**, use that dialog's **Save**, then the Text Block's main green **SAVE**.

Reopen the Text Block to check the saved reference. Reload the complete layout Preview and compare the displayed value with the exact source record. A saved placeholder or a selector entry alone does not prove successful field substitution.

Before relying on live updates, have the source owner make one approved test change and compare the value in a newly loaded Preview. Confirm the correct tab/record and record the observation time. Do not assume a fixed refresh delay, stable row positions or physical-display delivery from the configured update interval.

After restoring test data, compare the source and Preview again. Preview can temporarily retain an earlier value even when the published source has already changed; record both observations before treating the result as current.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) if the required field is missing or the saved reference displays incorrectly. Share the layout/module identity and sanitized evidence, not private source links.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368