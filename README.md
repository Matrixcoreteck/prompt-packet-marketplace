# AI Prompt Packs Marketplace — frontend

This is a real, runnable Vite + React project (not just a chat artifact),
so it can be pushed to GitHub and imported into Base44.

## Before you touch Base44: get this onto GitHub

You don't need to install anything or use the command line — GitHub lets
you upload files straight from your browser.

1. Go to github.com and log in (create a free account if you don't have one).
2. Click the **+** in the top right > **New repository**.
3. Name it something like `prompt-packs-marketplace`, keep it Public or
   Private (either works for Base44), and click **Create repository**.
4. On the new repo's page, click **Add file > Upload files**.
5. Unzip the file I gave you on your computer first, then drag the whole
   unzipped folder's contents into the GitHub upload box (index.html,
   package.json, vite.config.js, and the src folder).
6. Scroll down and click **Commit changes**.

Your code is now on GitHub.

## Importing into Base44

1. In Base44, open the menu on the home page and look for **Bring your own
   project** (under a GitHub project option).
2. Connect your GitHub account if you haven't already.
3. Paste your new repo's URL, or pick it from the list.
4. Base44 will check it, clone it, install dependencies, and start a preview.

From there, every change you make in Base44 gets saved back to that GitHub
repo — it stays the source of truth, so you (or I) can keep editing it
outside Base44 too if needed.

## A heads-up about data

This project currently uses a temporary local-storage stand-in
(`src/storageShim.js`) instead of a real database, because the original
version relied on a Claude.ai-only feature. That means:

- Data only lives in one browser — it won't be shared between different
  visitors to your site
- It's fine for previewing/testing the design in Base44, but it is **not**
  ready for real customers yet

When you're ready to go live, this needs to be swapped for real calls to
the Stripe/Supabase backend already built (see the
`prompt-marketplace-server` project), or to Base44's own built-in data
storage if you'd rather use that instead. Happy to do that wiring once
you've got the backend deployed — just say the word.
