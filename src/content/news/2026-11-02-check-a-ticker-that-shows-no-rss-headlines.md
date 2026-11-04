---
title: "Check a Ticker that shows no RSS headlines"
date: "2026-11-02"
slug: "2026-11-02-check-a-ticker-that-shows-no-rss-headlines"
image: "/images/news/placeholder.jpg"
excerpt: "Verify the saved feed and Custom Text override before treating an empty ticker as a layout failure."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

Start with the Ticker's saved feed and **Custom Text** fields. Custom Text overrides the RSS feed in the inspected form.

## Find the Ticker

Confirm the layout ID. Use **gear tab → Module Manager** to identify the Ticker by type and ID, then return with the **house tab** and open its sidebar entry. A customized label may hide the word Ticker.

## Check the source and save

1. Confirm that **RSS/Atom URL** contains the intended feed URL, rather than an ordinary website page.
2. Check that the feed can be read without a private browser login. A successful HTTP response alone does not prove that RunSAM can parse its headlines.
3. Inspect **Custom Text**. Preserve a useful message before clearing it for an authorized RSS test.
4. Select the module's main green **SAVE**.
5. Reopen Ticker and verify the exact feed URL and Custom Text state.
6. Reload the layout's Preview and look for actual headlines. Observe movement separately if scrolling is required.

![Ticker fields showing the Custom Text override note beneath RSS/Atom URL](https://media.wwds.co/u/pressly-pr-en-20261102-025-b0bd907c58b00688eb7002eeec25d878f12203abf120384070cfd86bf4009ed4.webp)

[Open the Ticker form screenshot at full size](https://media.wwds.co/u/pressly-pr-en-20261102-025-b0bd907c58b00688eb7002eeec25d878f12203abf120384070cfd86bf4009ed4.webp). This example has a custom message, so it illustrates the override fields rather than a successful RSS feed.

## If no headlines appear

Use an approved, independently valid alternate feed on a separate test layout. If a custom message works while feeds remain blank, the difference narrows the investigation but does not identify the cause or certify the connector.

Keep any custom-message fallback clearly identified as temporary content. It is not a successful RSS result. Feed-provider compatibility, freshness and physical-player behavior require their own checks.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca) with the layout/module identity, public feed address, observation time and timezone, saved-field check and alternate-feed result. Remove private tokens from reports.

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368