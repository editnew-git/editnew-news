---
title: "Check a Ticker that shows no RSS headlines"
date: "2026-11-02"
slug: "2026-11-02-check-a-ticker-that-shows-no-rss-headlines"
image: "/images/news/placeholder.jpg"
excerpt: "Verify the saved feed and Custom Text override before treating an empty ticker as a layout failure."
tags: ["troubleshooting", "runsam", "support"]
draft: false
---

Check the feed and any Custom Text override before changing the rest of the layout.

## When this applies

Use the Ticker form with **RSS/Atom URL** and **Custom Text** fields. The checks below concern RSS; they do not certify every feed provider or Atom variant.

## Before you begin

Open the correct layout and Ticker module. Have the intended public feed URL and retain any useful custom message before changing it.

## Check the feed

1. Confirm that the URL points to an actual RSS feed, rather than a normal website page.
2. Check whether that feed is accessible without your private browser login.
3. Inspect **Custom Text**. For an RSS test, preserve the existing message, then clear the override if you are authorized to replace it with feed content.
4. Save and reopen Ticker. Verify the exact feed URL and Custom Text state.
5. Reload Preview and look for real headlines. Observe movement separately; a still image does not confirm scrolling.

## If the ticker stays empty

Test an approved, independently valid alternate feed in a test layout. If custom text works but RSS does not, that narrows the issue to the feed path. A saved URL or HTTP success code alone does not establish that headlines loaded.

## Verify the result

The intended headlines appear in the reloaded Preview and the saved URL remains correct. Watch for movement separately if scrolling is required. Record a custom-text fallback as temporary content, not as a successful RSS result.

## When to contact support

Send the layout/module identity, public feed URL, observed time and timezone, saved-field check and alternate-feed result. Remove private tokens from shared reports. An approved custom message can be temporary content, but it does not repair the RSS failure or establish its cause.

Contact [EditNew Support](https://support.editnew.ca) at [info@editnew.ca](mailto:info@editnew.ca).

## About EditNew

Editnew Inc. is a technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368