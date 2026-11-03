---
title: "Check missing or incorrect Google Sheet data"
date: "2026-11-03"
slug: "2026-11-03-check-missing-or-incorrect-google-sheet-data"
image: "/images/news/placeholder.jpg"
excerpt: "Compare the sheet, Data Source, display module, Preview, and screen to find where expected data first stops matching."
tags: ["troubleshooting", "runsam"]
draft: false
---

If a connected Google Sheet's values are missing, old, or incorrect on a S.A.M. screen, compare each stage: the source sheet, Data Source, display module, Preview, and physical screen. This helps identify where the results first stop matching.

## Before you start

Have authorized access to the configured layout and the source sheet supplied at handoff. Know which tab, fields, and values you expect to see. Keep private data out of public sheets, screenshots, and support reports.

## Check each stage

1. **Check the source sheet.** Open the approved sheet and intended tab. Confirm that the expected values are present and saved. Check whether headings or referenced fields have changed; the layout may depend on their exact, unique names. Ask the layout owner before changing the sheet structure.

2. **Confirm the approved connection details.** Compare the configured connector and tab with your handoff instructions. The document identifier and tab GID are separate values. Editable spreadsheet IDs and published identifiers are also different. If the expected form is unclear, stop and use the [Data Source connection guide](https://support.editnew.ca/news/2026-08-06-how-to-connect-a-google-sheet-to-your-layout-part-1-data-source/) with support. Do not switch identifier formats or broaden sharing permissions by guesswork.

3. **Inspect Data Source, if you have access.** Check whether it shows the expected fields and actual rows from the intended sheet. A saved configuration alone does not confirm that data loaded. If this stage is empty or incorrect, record the visible warning and the mismatch.

4. **Check the display module.** If Data Source is correct, confirm that the Data Table uses that source and includes the intended fields. If the layout uses a TextBlock, check that it references the intended item. Ask the layout owner to help if these controls are outside your normal editing access.

5. **Compare Preview.** Reopen or reload Preview after the normal refresh process for your installation. For a table with multiple frames, watch later frames too; the number of rows per frame is not the total number of records. The [Data Table guide](https://support.editnew.ca/news/2026-08-08-part-2-how-to-connect-a-google-sheet-to-your-layout-data-table/) explains these display settings.

6. **Check the physical screen.** Confirm which layout the affected player uses and compare its output with Preview. Record whether the problem affects one screen or several.

## Expected result

You can identify the first stage where the expected data is missing or different, or confirm that the values now match throughout.

If the problem remains, send support the layout and module names, intended tab and field, expected and actual values, visible warnings, and the first stage that differs. Use your agreed support route or [EditNew Support](https://support.editnew.ca). Ask about refresh expectations if timing is uncertain; do not assume an immediate update.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368