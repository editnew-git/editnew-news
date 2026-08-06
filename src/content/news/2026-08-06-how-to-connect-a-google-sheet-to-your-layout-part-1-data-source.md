---
title: "How to Connect a Google Sheet to Your Layout – Part 1 (Data Source)"
subheadline: "Connect published Google Sheet data to a S.A.M. layout using the Data Source module."
date: "2026-08-06"
slug: "2026-08-06-how-to-connect-a-google-sheet-to-your-layout-part-1-data-source"
image: "/images/news/placeholder.jpg"
excerpt: "Learn how to publish a Google Sheet, add Data Source and Data Table modules to a S.A.M. layout, and connect the sheet using its Spreadsheet ID and GID."
tags: ["training", "layouts", "runsam", "google-sheets"]
draft: false
---

Connect a Google Sheet to your S.A.M. layout using the Data Source module. By the end of this guide, your spreadsheet data will appear in the layout and be ready for display customization in a Data Table.

## Before you begin

You will need:

- A Google account with access to Google Sheets
- A Google Sheet containing the data you want to display
- Access to the S.A.M. Layout Editor on [RunSam.com](https://runsam.com)

Publishing a spreadsheet to the web makes its contents publicly accessible. Do not include private, personal, confidential, or sensitive information in the sheet.

## 1. Create a Google Sheet

Create a new Google Sheet and enter your data. Use the first row for your column headings, then enter your data in the rows below the headings.

![Google Sheet with a heading row and sample data beneath it](https://media.wwds.co/u/87314c3d-0141-49be-9571-cf438720fac2.webp)

## 2. Open the File menu

In your Google Sheet, select **File**.

![Google Sheets File menu highlighted](https://media.wwds.co/u/a7dca796-8a3c-4fb9-9624-fcc317fbd3f5.webp)

## 3. Open Publish to web

Select **Share**, then select **Publish to web**.

![Google Sheets Share submenu with Publish to web highlighted](https://media.wwds.co/u/cc097465-4316-49ed-ae00-73c9b8e8e94a.webp)

## 4. Publish the spreadsheet

In the Publish to the web window, select **Publish**.

![Publish to the web dialog with the Publish button highlighted](https://media.wwds.co/u/f9e6087a-1646-44a2-8153-a09690c1f886.webp)

## 5. Confirm the action

Select **OK** to confirm that you want to publish the spreadsheet.

![Publish confirmation dialog with the OK button highlighted](https://media.wwds.co/u/54812339-d7d4-40c8-a894-4f8f71e0a6cc.webp)

## 6. Open your layout

Return to your S.A.M. layout and select the **gear** icon in the upper-right corner of the Layout Editor.

![S.A.M. Layout Editor with the gear icon highlighted](https://media.wwds.co/u/f9fad0d6-e4e3-4e5b-a78c-dcba804b1940.webp)

## 7. Open the Module Manager

Select **Module Manager**.

![S.A.M. Layout Editor with Module Manager highlighted](https://media.wwds.co/u/52b5add4-e9ec-48d3-9f1f-8dcac280c88d.webp)

## 8. Select a module type

Open the **Select type** menu.

![S.A.M. module manager with the module type selector highlighted](https://media.wwds.co/u/a9841798-f2b9-4447-b166-dcbbdc6dea15.webp)

## 9. Add the required modules

Select and add both of these modules:

- **Data Source**
- **Data Table**

![S.A.M. module type menu with Data Source and Data Table highlighted](https://media.wwds.co/u/4ab05248-763d-41b4-bf1a-2adce26a1cdc.webp)

## 10. Save the modules

Select **Add Module** for each module. Once both modules have been added, select **Save**.

![S.A.M. Module Manager with Add Module and Save controls highlighted](https://media.wwds.co/u/99c7004d-f241-4a73-9ea6-faae9894320a.webp)

## 11. Open the Data Source module

Select the **Data Source** module.

![S.A.M. Layout Editor with the Data Source module highlighted](https://media.wwds.co/u/3faf259d-4fba-4404-b4ef-a47f8045a5a6.webp)

## 12. Name the module

Enter a clear name for your Data Source module.

![S.A.M. Data Source module name field highlighted](https://media.wwds.co/u/a13f62fb-0d48-41cd-8b96-4851dca615c0.webp)

## 13. Choose a connector

Select the **Connector** field to choose a data source.

![S.A.M. Data Source settings with the Connector field highlighted](https://media.wwds.co/u/14bb6b25-f4cb-4a1e-9f99-fc4f9c5b3125.webp)

## 14. Select Google Docs

From the available connectors, select **Google Docs**.

![S.A.M. Connector menu with Google Docs highlighted](https://media.wwds.co/u/6ca40014-60fd-42d4-b371-c6d80a95b633.webp)

## 15. Copy the Google Spreadsheet ID

Return to your Google Sheet and copy the Spreadsheet ID from the browser address bar. The Spreadsheet ID is the text between `/d/` and `/edit` in the URL.

For example, in this URL:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

Copy only `SPREADSHEET_ID`.

![Google Sheets Publish to the web dialog with the spreadsheet identifier highlighted](https://media.wwds.co/u/59bd0258-b623-466d-a704-64ad3f7ebf25.webp)

## 16. Paste the Spreadsheet ID

Return to your layout and paste the copied Spreadsheet ID into the **Google Document ID String** field.

![S.A.M. Data Source settings with the Google Document ID String field highlighted](https://media.wwds.co/u/dba7afeb-2fcb-4abe-9e9a-ce61709966c2.webp)

## 17. Copy the Google Sheet GID

Go back to your Google Sheet and find the `gid` value in the browser address bar. For example, if the URL ends with `gid=0`, copy only `0`.

## 18. Enter the GID

Paste the number into the **Google Sheet GID #** field, then select **Save**.

## 19. Verify the connection

Confirm that your spreadsheet data appears in the Data Source module. If it does, the Google Sheet is connected successfully.

## 20. Customize your Data Table

Use the Data Table module to control how your Google Sheet data is displayed, including:

- Font style and size
- Text colour
- Row and column formatting
- Position and layout
- Other display settings

These options will be covered in **Part 2: How to Connect a Google Sheet to Your Layout (Data Table)**.

## Expected result

Your published Google Sheet data appears in the S.A.M. Data Source module and is ready to be formatted through the Data Table module.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368