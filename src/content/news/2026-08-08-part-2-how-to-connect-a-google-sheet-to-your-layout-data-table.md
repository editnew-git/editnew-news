---
title: "Part 2: How to Connect a Google Sheet to Your Layout (Data Table)"
subheadline: "Use the Data Table module in S.A.M. to control how Google Sheet data appears in your layout."
date: "2026-08-08"
slug: "2026-08-08-part-2-how-to-connect-a-google-sheet-to-your-layout-data-table"
image: "/images/news/placeholder.jpg"
excerpt: "Learn how to connect a Data Table module to a Google Sheet, choose which fields appear, and customize the table with Basic, Advanced, and Expert controls."
tags: ["training", "layouts", "runsam", "google-sheets", "data-table"]
draft: false
---

Use the Data Table module in [RunSam.com](https://runsam.com) to control how data from a connected Google Sheet appears in your S.A.M. layout.

## Before you begin

Make sure your Google Sheet is already connected through the intended Data Source and loads the expected rows. Use only data approved for public access. Hiding a Data Table field does not restrict access to the underlying spreadsheet.

## 1. Open the Data Table module

Open your layout, then select the **Data Table** module.

![S.A.M. layout editor with the Data Table module highlighted in the sidebar.](https://media.wwds.co/u/2a741a16-cd0e-452f-8f6d-14695460f8bb.webp)

## 2. Name the Data Table module

Enter a clear name for the Data Table module, then select **Save**.

![Data Table module name field and Save button highlighted.](https://media.wwds.co/u/d62a61d9-9771-457d-8ef4-72bda7797b5e.webp)

## 3. Configure the Basic controls

Use the Basic controls to configure how the Google Sheet data is displayed:

- **Source:** View and select the Data Source connected to the Data Table module.
- **Style:** Choose a **Vertical** or **Horizontal** orientation.
- **Number of rows per frame:** Set how many rows appear at one time.
- **Time between frames:** Set how long each group of rows remains visible before the next group appears. This is useful when the spreadsheet contains more rows than can fit on screen at once.
- **Transition:** Choose the visual effect used when the table moves from one frame to the next.

When you finish configuring the Basic controls, select **Save**.

![Data Table Basic controls for source, style, rows per frame, timing, and transition.](https://media.wwds.co/u/56114b51-fd06-4d67-84a2-25534efcba0b.webp)

## 4. Verify the data connection

After selecting the intended Source, save and reopen Data Table. Check that real column names appear under **Included Fields**. Their appearance is a useful checkpoint; also verify nonempty rows from the intended Sheet in Preview before considering the connection complete.

![Included Fields section showing a Google Sheet field available in the Data Table module.](https://media.wwds.co/u/f644aa17-5fc3-4b99-a3b2-8fc7e337900b.webp)

## 5. Enable fields and open Advanced settings

Explicitly turn on each field you want to display. Do not use an all-Off selection as a way to hide all data. Save and reopen the module to confirm the selection persists, then select **Advanced** for additional customization.

![Included field enabled and Advanced button highlighted in the Data Table module.](https://media.wwds.co/u/d8173933-fbc3-402a-ab26-61d10a83c1f5.webp)

## 6. Configure the Advanced controls

Use the Advanced controls to customize the appearance and position of the Google Sheet data. Available settings include position, dimensions, opacity, font size, colors, borders, and row height.

These controls help you fit the table to your layout and visual design. The Advanced view also provides access to **Expert** controls for CSS customization.

![Data Table Advanced controls for position, dimensions, colors, borders, and font size.](https://media.wwds.co/u/e4fe0e44-2029-4344-8996-202ca628e2e3.webp)

## 7. Use Expert controls

Select **Expert** to customize the Data Table module with CSS. Use this option for visual changes that are not available through the Basic or Advanced controls.

> **Note:** Expert controls are recommended for users familiar with CSS and web-based styling. Basic settings can override Expert CSS, so configure and save the Basic controls first.

![Data Table Expert controls showing the CSS editor and Save button.](https://media.wwds.co/u/1664ed87-ada8-42f6-acf8-7e896f5ce99f.webp)

## Expected result

Your Data Table should display the selected Google Sheet fields with the orientation, timing, transitions, formatting, and positioning you configured.

The Data Table module provides three levels of customization:

- **Basic controls:** Configure the data source, orientation, number of rows, display timing, and transitions.
- **Advanced controls:** Adjust formatting, positioning, dimensions, fonts, colors, and borders.
- **Expert controls:** Use CSS for more advanced customization.

Save your changes, then use **Preview** to confirm that the data displays correctly in the layout.

## Verify the displayed data

Reload Preview and check both the wanted columns and the absence of unwanted columns. Compare actual rows with the intended public Sheet. If the table uses frames, observe later frames too: rows per frame is not the total record count.

If fields or rows remain missing, contact support with the layout identity, selected source, expected fields and warning text. Keep private data and access-bearing links out of public support messages.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368