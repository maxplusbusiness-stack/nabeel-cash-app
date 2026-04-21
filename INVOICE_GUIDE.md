# Invoice Feature — Setup Guide

## What was added

Each transaction now has a 📄 button. Tap it to:
- See a full professional invoice for that transaction
- Send via WhatsApp (opens WhatsApp with pre-filled message)
- Send via Email (opens your email app)
- Print or Save as PDF
- Copy text to clipboard

The invoice shows:
- Transaction details (description, date, category, person, amounts)
- Full account summary for that person (total given, spent, returned, outstanding balance)
- Overall cash in hand balance

---

## Step 1 — Update your GitHub files

1. Go to github.com → your `nabeel-cash-app` repository
2. Navigate to `src/app/` → click `page.tsx` → pencil icon → replace ALL content with the new `page.tsx`
3. Navigate to `src/components/` folder
   - If the folder does not exist: click **Add file** → **Create new file** → type `src/components/Invoice.tsx` as the filename
   - If it exists: click `Invoice.tsx` → pencil icon
4. Paste the full content of `Invoice.tsx` from the zip
5. Click **Commit changes** on each file

Vercel will automatically redeploy within 2 minutes.

---

## Step 2 — How to use the invoice

1. Open your app → go to **Transactions** tab
2. Find any transaction — you will see a 📄 button next to Edit/Del
3. Tap 📄 to open the invoice preview
4. Choose how to send:

### Send via WhatsApp
- Tap **WhatsApp** button
- WhatsApp opens with the full invoice message pre-typed
- Select the contact and send — done!

### Send via Email
- Tap **Email** button
- Your email app opens with subject and body pre-filled
- Add the recipient email address and send

### Print or Save as PDF
- Tap **Print / PDF**
- Your browser print dialog opens
- On phone: tap **Share** → **Save as PDF**
- On laptop: select **Save as PDF** as the printer

### Copy Text
- Tap **Copy Text**
- The invoice text is copied to your clipboard
- Paste it anywhere — SMS, Telegram, notes, etc.

---

## What the invoice includes

- Invoice number (auto-generated from date + transaction ID)
- Transaction: description, date, category, person, status
- Amounts: given out, spent by person, returned
- **Account Summary for that person:**
  - Total given to them across all transactions
  - Total spent by them
  - Total returned
  - Outstanding balance
- **Overall cash in hand** (your current total)

---

## Tips

- Mark a transaction as **Settled** (✓ button) before sending the invoice to show SETTLED status
- The invoice automatically reflects real-time data — outstanding balance is always current
- WhatsApp links work on both phone and desktop (desktop opens WhatsApp Web)
