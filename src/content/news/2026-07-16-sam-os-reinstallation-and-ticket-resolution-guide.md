---
title: "SAM OS Reinstallation and Ticket Resolution Guide"
subheadline: "A technician reference for downloading the stable SAM OS image, creating a bootable USB installer, reinstalling a SAM Stick, and verifying security status after recovery."
date: "2026-07-16"
slug: "2026-07-16-sam-os-reinstallation-and-ticket-resolution-guide"
image: "/images/news/placeholder.jpg"
excerpt: "Use this guide to reinstall the SAM operating system on a SAM Stick, verify network connectivity, and complete the security token checks required before closing a support ticket."
tags: ["troubleshooting", "training", "support", "runsam"]
draft: true
---

This guide explains how to recover a SAM Stick by reinstalling the stable SAM operating system, reconnecting the device to the network, and completing the required post-installation security checks.

Use this process when a SAM Stick requires a clean operating system installation to restore normal operation.

## Overview

The recovery process includes:

1. Downloading the latest stable SAM operating system image.
2. Downloading the USB Writer utility.
3. Creating a bootable USB installer.
4. Booting the SAM Stick from the USB drive.
5. Allowing the installer to write the operating system.
6. Reconnecting the device to the network.
7. Verifying the device security token status before closing the ticket.

## Before You Begin

You need:

- USB flash drive
- USB keyboard
- USB-to-Micro USB adapter, preferred when supported by the hardware
- Internet-connected Windows computer
- Hardwired Ethernet connection for the SAM Stick, recommended
- Authorized access to the SAM download portal
- USB Writer utility
- Device sign number or assigned device identifier

## 1. Open the SAM Download Portal

Go to [RunSam.com](https://runsam.com) and sign in with an authorized account.

Open the SAM download area and confirm that the page is showing the stable branch.

## 2. Download the Stable SAM OS Image

In the download options:

1. Set the branch to **Stable Branch**.
2. Locate the operating system image for **SAM Stick**.
3. Download the latest stable image.

The current stable revision may change over time. In the source walkthrough, revision **1034** was the latest stable image shown for the SAM Stick. Always use the latest stable version available at the time of service.

## 3. Download USB Writer

From the same download area:

1. Change the download category to **Tools**.
2. Download **USB Writer**.
3. Install or run the utility on the Windows computer.

If Windows shows a security warning, confirm that the file came from the authorized SAM download portal before selecting **Run Anyway**.

## 4. Create the Bootable USB Drive

Open **USB Writer** and complete the installer media:

1. Select the downloaded SAM OS image.
2. Select the USB flash drive.
3. Click **Write**.
4. Wait for the write process to reach **100%**.

When the write process finishes, the USB drive is ready to reinstall the SAM Stick.

## 5. Prepare the SAM Stick

Connect the following to the SAM Stick:

- Bootable USB drive
- USB keyboard
- Supported USB adapter

Use the original USB adapter supplied with the device when available. If the original adapter is not available, use a compatible Micro-USB or USB-C solution supported by the hardware.

## 6. Boot from USB

Power on the SAM Stick and immediately open the boot menu or BIOS setup.

Set the USB device as the first boot option. The USB drive may appear under its manufacturer name, such as SanDisk.

Save the boot settings and restart the device.

## 7. Install the Operating System

The installer should start automatically.

During installation, the screen may show messages such as:

- Installing to Hard Drive
- Writing System Files
- Preparing Installation

Allow the installation to complete without interruption. When installation finishes, a green completion screen should confirm that the process completed successfully.

After the completion screen appears:

1. Remove the USB drive.
2. Remove the keyboard.
3. Reboot the device.

## 8. Connect the Device to the Network

Use a known-good wired Ethernet connection whenever possible.

A wired connection allows the SAM Stick to:

- Contact company servers
- Validate the installation
- Complete provisioning
- Download required configuration

Wired Ethernet is the recommended deployment method for a recovery installation.

## 9. Use an Approved Wi-Fi Fallback Only When Needed

If Ethernet is unavailable, use the currently approved internal Wi-Fi hotspot method for the deployment environment.

Confirm the current SSID and password in internal documentation before using this fallback. Do not rely on old credentials from previous support tickets.

After connecting, allow the SAM Stick to communicate with the server and complete operating system deployment.

## 10. Complete Security Verification

After reinstalling the operating system, notify the internal support or security team with:

- Device sign number
- Device that was reflashed
- Support ticket or work order reference, when applicable

Installing a new operating system can generate a new security token. The security team may need to verify the device or enable the required token bypass before normal operation resumes.

Do not close the ticket until the token status has been confirmed.

## 11. Confirm the Device Status

Before closing the ticket, confirm:

- Stable OS image was downloaded
- USB Writer completed successfully
- Bootable USB drive was created
- Device booted from the USB drive
- Installation completed
- Green completion screen appeared
- USB drive and keyboard were removed
- Device rebooted successfully
- Network connection was verified
- Device connected to company servers
- Security token status was verified
- Sign number was reported when required
- Device is operating normally

## Expected Result

The SAM Stick should boot from the newly installed stable operating system, connect to the network, complete provisioning, and resume normal operation after security verification is complete.

## Documentation Requirement

After the repair:

1. Capture screenshots of each major step.
2. Record the operating system revision used.
3. Record the device sign number or assigned device identifier.
4. Document network and security verification results.
5. Update the support ticket with the final outcome.
6. Update this guide when the installation process, available tools, or stable operating system revisions change.

## Key Takeaways

- Use the **Stable Branch** for production installations.
- Use **USB Writer** to create the installation media.
- Prefer wired Ethernet during recovery.
- Use approved Wi-Fi fallback credentials only from current internal documentation.
- Verify the security token status after every operating system reinstall.
- Document each completed recovery to improve future support and technician training.

## About EditNew

Editnew Inc. is a Canadian technology company specializing in new media, with a focus on digital signage and emergency communication solutions. We help organizations and reseller partners deploy, manage, and support reliable information and notification systems.

## Media Contact

Jeremiah Archambault
info@editnew.ca
+1 250 999 9368