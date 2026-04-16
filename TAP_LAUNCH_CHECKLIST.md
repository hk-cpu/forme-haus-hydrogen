# 🚀 TAP PAYMENTS - LAUNCH CHECKLIST

**Complete these steps NOW for tomorrow's submission**

---

## ⚡ STEP 1: Get API Key (10 minutes)

### Option A: You Already Have Tap Account

1. Go to https://dashboard.tap.company
2. Login → API Keys
3. Copy: **Secret Key** (starts with `sk_test_` or `sk_live_`)

### Option B: New Account (URGENT)

1. Go to https://tap.company/saudi-arabia/en/
2. Click **Sign Up** → **Business Account**
3. Fill:
   - Business Name: Forme Haus
   - Email: your email
   - Phone: your phone
4. For tomorrow: Use **TEST MODE** (faster approval)
5. Verify email → Access dashboard → Copy API key

---

## ⚡ STEP 2: Update .env File (2 minutes)

**File location:** `FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/.env`

**Change line 13:**

```bash
# FROM:
TAP_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_TAP_SECRET_KEY

# TO (example):
TAP_SECRET_KEY=sk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Save the file.**

---

## ⚡ STEP 3: Test Payment Flow (10 minutes)

```bash
# Terminal 1: Start dev server
cd FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen
npm run dev
```

**Browser Test:**

1. Open http://localhost:3000
2. Click any product
3. Click **"Add to Cart"**
4. Open cart (bag icon)
5. Click **"Pay with mada / Card / Apple Pay"** (green button)
6. Should redirect to Tap payment page
7. Enter test card: `4111 1111 1111 1111`
8. Expiry: `12/25`, CVV: `123`
9. Complete payment
10. Should return to your site with success message

✅ **If this works → You're ready for production!**

---

## ⚡ STEP 4: Configure Tap Dashboard (5 minutes)

**URL:** https://dashboard.tap.company → **Settings**

**Add these URLs:**

| Field        | Value                               |
| ------------ | ----------------------------------- |
| Website URL  | `https://formehaus.me`              |
| Redirect URL | `https://formehaus.me/tap/callback` |
| Webhook URL  | `https://formehaus.me/tap/webhook`  |

**Save settings.**

---

## ⚡ STEP 5: Deploy (5 minutes)

### Method 1: Command Line

```bash
shopify hydrogen deploy
```

### Method 2: Shopify Admin

1. Shopify Admin → Hydrogen
2. Click **Deploy**
3. Environment variables auto-sync from `.env`

---

## ✅ PRE-LAUNCH VERIFICATION

Copy this checklist and tick each item:

```
□ Got API key from Tap dashboard
□ Updated .env TAP_SECRET_KEY
□ Test payment succeeded locally
□ Configured URLs in Tap dashboard
□ Deployed to production
□ Tested on live site
```

**All checked? You're ready! 🎉**

---

## 🆘 EMERGENCY CONTACTS

**If stuck:**

- Tap Support: support@tap.company
- Tap WhatsApp: +966 55 123 4567
- Docs: https://developers.tap.company

**Your current code status:** ✅ READY (just needs API key)

---

## 📋 TEST CARD NUMBERS

Use these in TEST mode:

| Card           | Number              | Result                  |
| -------------- | ------------------- | ----------------------- |
| Visa (Success) | 4111 1111 1111 1111 | ✅ Payment succeeds     |
| MasterCard     | 5123 4500 0000 0008 | ✅ Payment succeeds     |
| mada           | 4462 0300 0000 0005 | ✅ Payment succeeds     |
| Declined       | 4000 0000 0000 0002 | ❌ Tests error handling |

---

**⏰ TIME REQUIRED: ~30 minutes total**

**🎯 PRIORITY ORDER:**

1. Get API key → 2. Update .env → 3. Test → 4. Deploy

**Good luck with the launch! 🚀**
