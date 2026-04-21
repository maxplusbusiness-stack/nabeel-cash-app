# Nabeel — Petty Cash Manager Web App

A free web app to track petty cash, people, and transactions.

---

## STEP 1 — Set up Supabase (your database)

1. Go to https://supabase.com and sign up for free
2. Click **New Project** — give it any name like "nabeel-cash"
3. Choose a strong password and click **Create project** (wait ~1 minute)
4. On the left sidebar, click **SQL Editor**
5. Click **New query**
6. Open the file `supabase_schema.sql` from this folder, copy ALL the text inside it
7. Paste it into the SQL editor and click **Run**
8. You should see "Success" — your database tables are created!

Now get your keys:
9. Click **Project Settings** (gear icon) → **API**
10. Copy the **Project URL** (looks like https://xxxx.supabase.co)
11. Copy the **anon public** key (long text starting with eyJ...)
12. Save these two values — you need them in Step 3

---

## STEP 2 — Upload code to GitHub

1. Go to https://github.com and sign up / log in
2. Click the **+** button (top right) → **New repository**
3. Name it: `nabeel-cash-app`
4. Keep it **Public**, click **Create repository**
5. Click **uploading an existing file** link on the page
6. Upload ALL the files from this folder (drag and drop the whole folder contents)
   - Important: keep the folder structure exactly as is
7. Click **Commit changes**

---

## STEP 3 — Deploy on Vercel (make it live)

1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Find and select your `nabeel-cash-app` repository, click **Import**
4. Before clicking Deploy, click **Environment Variables** and add these two:

   | Name | Value |
   |------|-------|
   | NEXT_PUBLIC_SUPABASE_URL | (your Supabase Project URL from Step 1) |
   | NEXT_PUBLIC_SUPABASE_ANON_KEY | (your Supabase anon key from Step 1) |

5. Click **Deploy** and wait ~2 minutes
6. Vercel gives you a live link like: https://nabeel-cash-app.vercel.app

---

## STEP 4 — Open your app!

- Open the link Vercel gave you on any phone or laptop
- Go to ⚙ Settings first and enter your opening cash amount
- Start adding transactions!

---

## How to use the app

**Dashboard** — See cash in hand, totals, and how much each person is holding

**Transactions** — Add, edit, or delete transactions
- Given out = cash you gave to someone
- Spent by person = what they spent from that cash
- Returned = cash they gave back to you

**People** — Add or remove people from the tracker

---

## Updating the app later

If you want to change something, just edit the files in GitHub and Vercel will automatically re-deploy within 1-2 minutes.
