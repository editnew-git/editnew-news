---
title: "Part 2: How to Connect a Google Sheet to Your Layout (Data Table)"
subheadline: "Use the Data Table module in S.A.M. to control how Google Sheet data appears in your layout."
date: "2026-08-08"
slug: "2026-08-08-part-2-how-to-connect-a-google-sheet-to-your-layout-data-table"
image: "/images/news/placeholder.jpg"
excerpt: "Select a verified Data Source, choose explicit fields and check real rows before styling the Data Table."
tags: ["training", "layouts", "runsam", "google-sheets", "data-table"]
draft: false
---

Use **Data Table** to choose and format fields from a working **Data Source**. Confirm the real source columns and rows before changing the table's appearance.

## Select the source

1. Confirm the layout ID and the Data Table type/ID in **gear tab → Module Manager**.
2. Return with the **house tab** and open that module's sidebar entry.
3. In **Source**, select the intended Data Source. A label such as Set Label can be ambiguous; confirm its module identity first.
4. Select the main green **SAVE** and reopen Data Table to load its field controls. A source can appear selected before the module has saved that choice.
5. Inspect **Included Fields**. The names must match the real source headers. If the list remains empty or contains HTML/error-page fragments, resolve the connector before formatting or inserting fields.

## Configure the table

| Control | Purpose to verify |
| --- | --- |
| Style | Horizontal or Vertical; the inspected selector spells the latter “Veritcal.” |
| Number of rows per frame | Rows in each displayed group, not the total source-record count. |
| Time between frames (s) | The configured interval between groups. |
| Transition | The available visual transition, such as None or Fade. |
| Show Label as Caption | Whether the module label is used as a caption. |
| Included Fields | The columns explicitly selected for display. |

Select the required fields explicitly, use the main green **SAVE**, and reopen the module to check the stored selection and options. Do not use an all-Off selection as a method of hiding all data; verify the actual rendered result.

![Data Table editor with the sample label and value fields switched On, other fields Off, and main SAVE at the top right](https://media.wwds.co/u/pressly-pr-en-20260808-001-452e698663582d8480dbcae6fd52e4f446d0b81212f82ce89a824e6ae535af43.webp)

[Open the Data Table controls at full size](https://media.wwds.co/u/pressly-pr-en-20260808-001-452e698663582d8480dbcae6fd52e4f446d0b81212f82ce89a824e6ae535af43.webp). The selected columns and two-row/two-second settings are examples.

Open **Advanced** for position, dimensions, opacity, font, colors and borders. **Expert** exposes CSS controls for authors who understand the layout. Change one layer at a time and reopen it after saving; this guide does not prescribe a universal precedence rule between basic controls and custom CSS.

## Verify rows and presentation

Use the table toolbar's **Preview** to inspect its formatted rows, then reload the complete layout Preview. Compare actual rows with the intended source tab, check both wanted columns and the absence of unwanted columns, and observe later frames where applicable. Inspect clipping, readability and overlap at the intended dimensions.

Field selection is a presentation setting, not a source-data security boundary. Verify physical-display output separately.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the layout/module identity, selected source, expected columns and sanitized warnings if fields or rows remain wrong.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368