---
title: "Check custom content in the Html/Code module"
date: "2026-11-02"
slug: "2026-11-02-prepare-page-markup-for-an-html-code-module"
image: "/images/news/placeholder.jpg"
excerpt: "Identify the Html/Code editor, preserve the source and investigate rendering with a minimal example."
tags: ["training", "layouts", "runsam", "daily-use"]
draft: false
---

Use **Html/Code** for advanced custom content in an authorized test layout. Keep the original code and confirm the module type and ID before editing it.

## Open the correct code editor

1. Confirm the layout ID.
2. Select **gear tab → Module Manager** and identify **Html/Code** by type and ID.
3. Return with the **house tab** and open that module's sidebar entry.
4. The inspected editor says **Paste code into text window** and has a main green **SAVE**. Do not confuse it with the Source code dialog inside a Media or Text Block editor.

Start with a small, understood example on a separate copy. Preserve the existing code before changing it. After saving, reopen the editor to inspect the saved source, then reload the layout Preview and check the visible result.

## If only the background appears

Compare a minimal version with the full content. Check the visible markup, CSS positioning, asset requests and any script error separately. An empty or background-only result does not by itself identify a document-wrapper problem.

There is no universal instruction here to remove `html`, `head` or metadata, retain a `body` wrapper, or relocate scripts. The required structure depends on the template and code; a blanket rewrite can change its behavior. Have an advanced author or support verify the expected structure for that module before replacing working content.

The presence of a code editor does not certify arbitrary scripts, libraries, games, remote controls or physical-player support. Do not paste code you do not understand or are not authorized to run.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the layout/module identity and a sanitized minimal reproduction if the result remains wrong.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368