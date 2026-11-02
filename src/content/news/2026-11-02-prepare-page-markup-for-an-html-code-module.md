---
title: "Prepare page markup for an Html/Code module"
date: "2026-11-02"
slug: "2026-11-02-prepare-page-markup-for-an-html-code-module"
image: "/images/news/placeholder.jpg"
excerpt: "Adapt trusted page markup to the documented Code-module boundary while preserving its CSS, body content and scripts."
tags: ["training", "layouts", "runsam", "daily-use"]
draft: false
---

For advanced authors, the documented Code-module input uses the style and body portions of page markup rather than a complete HTML document wrapper.

## Before you begin

Work in an authorized test layout or a verified copy. Keep the original code. Use only code you understand and are authorized to run; the presence of Try or Save does not establish that unknown scripts are harmless or sanitized.

## Adapt the document structure

1. Identify the intended **Html/Code** module by type and layout ID.
2. Preserve the original CSS, visible body markup and required JavaScript.
3. Remove the document-level `<!DOCTYPE html>`, opening `<html>` and `<head>` wrappers, head-only metadata such as `<meta>` and `<title>`, and the corresponding closing wrappers.
4. Retain the CSS in `<style>` and the page content in `<body>`. Keep the required script inside the body, before `</body>`.
5. Use the resulting structure in the Code module and verify the intended rendering in the test layout.

```html
<style>
  /* Your existing CSS */
</style>
<body>
  <!-- Your existing page content -->
  <script>
    // Your existing JavaScript, if required
  </script>
</body>
```

## If only the background renders

Check for a leftover full-document wrapper before rewriting the page's inner logic. A background-only result can have other causes; this check does not establish that all scripts, libraries, browser games or remote controls are supported.

Contact support with the layout identity and a sanitized, minimal reproduction if the intended content still fails. Browser rendering and physical-player behavior require separate verification.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca).

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368