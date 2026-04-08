# 🚀 Tap Payments - Production Setup Guide
**Deadline: Tomorrow** | **Status: Code Ready, Needs API Keys**

---

## ✅ CURRENT STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Tap Initiate Route | ✅ Ready | `app/routes/($locale).tap.initiate.tsx` |
| Tap Callback Route | ✅ Ready | `app/routes/($locale).tap.callback.tsx` |
| Tap Webhook Route | ✅ Ready | `app/routes/($locale).tap.webhook.tsx` |
| Cart Integration | ✅ Ready | Button visible in cart |
| API Key | ❌ **NEEDS UPDATE** | Currently placeholder |

---

## 🎯 ACTION ITEMS (DO NOW)

### Step 1: Get Tap Dashboard Access (15 min)

1. Go to **https://dashboard.tap.company**
2. Login with your business account
3. If no account:
   - Sign up at https://tap.company/saudi-arabia/en/
   - Submit KYC documents (business license, ID)
   - **For tomorrow's launch:** Use TEST mode first

### Step 2: Get Your API Keys (5 min)

In Tap Dashboard:
1. Go to **API Keys** section
2. Copy your **Secret Key**
   - Test: `sk_test_xxxxx`
   - Live: `sk_live_xxxxx`

### Step 3: Update Environment Variables (2 min)

**File:** `.env`

Replace line 13:
```bash
# ❌ CURRENT (PLACEHOLDER)
TAP_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_TAP_SECRET_KEY

# ✅ FOR TESTING TOMORROW
TAP_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_KEY_HERE

# ✅ FOR PRODUCTION (AFTER GO-LIVE)
TAP_SECRET_KEY=sk_live_YOUR_ACTUAL_LIVE_KEY_HERE
```

### Step 4: Configure Tap Dashboard URLs (10 min)

In Tap Dashboard → Settings → Webhooks/URLs:

| Setting | Test Mode | Production Mode |
|---------|-----------|-----------------|
| **Website URL** | `http://localhost:3000` | `https://formehaus.me` |
| **Redirect URL** | `http://localhost:3000/tap/callback` | `https://formehaus.me/tap/callback` |
| **Webhook URL** | `http://localhost:3000/tap/webhook` | `https://formehaus.me/tap/webhook` |

---

## 🔧 PAYMENT FLOW TESTING

### Pre-Launch Test Checklist

```bash
# 1. Start dev server
cd FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen
npm run dev

# 2. Add item to cart
# 3. Open cart drawer
# 4. Click "Pay with mada / Card / Apple Pay"
# 5. Should redirect to Tap hosted page
# 6. Use test card: 4111 1111 1111 1111
# 7. Complete payment
# 8. Should return to /tap/callback?tap_id=xxx
```

### Test Cards (Tap Test Mode)

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa | 4111 1111 1111 1111 | 12/25 | 123 |
| MasterCard | 5123 4500 0000 0008 | 12/25 | 123 |
| mada | 4462 0300 0000 0005 | 12/25 | 123 |
| Declined | 4000 0000 0000 0002 | 12/25 | 123 |

---

## 🚨 CRITICAL CHECKLIST FOR TOMORROW

### Before Submitting

- [ ] ✅ Tap Dashboard account created
- [ ] ✅ API Keys copied from dashboard
- [ ] ✅ `.env` file updated with real key
- [ ] ✅ Test payment completed successfully
- [ ] ✅ Callback URL working
- [ ] ✅ Webhook responding 200 OK
- [ ] ✅ Error handling tested

### Environment Variables Final Check

```bash
# Required in .env for Tap to work
TAP_SECRET_KEY=sk_test_xxxxx       # ← UPDATE THIS
TAP_API_URL=https://api.tap.company/v2

# Required for Shopify checkout
PUBLIC_CHECKOUT_DOMAIN=checkout.formehaus.me
```

---

## 🌐 DEPLOYMENT TO OXYGEN (SHOPIFY HOSTING)

### Method 1: Shopify Admin (Easiest)

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Open **Hydrogen** storefront
3. Go to **Environment variables**
4. Add:
   - `TAP_SECRET_KEY` = your key
   - `TAP_API_URL` = `https://api.tap.company/v2`
5. **Save & Redeploy**

### Method 2: CLI

```bash
# Login to Shopify
shopify auth login

# Set environment variables
shopify hydrogen env push --env-file .env

# Deploy
shopify hydrogen deploy
```

---

## 🔍 TROUBLESHOOTING

### Issue: "Payment service unavailable" error
**Fix:** Check `TAP_SECRET_KEY` is correct in `.env`

### Issue: Redirect fails after payment
**Fix:** Check callback URL in Tap Dashboard matches your domain

### Issue: Webhook not receiving events
**Fix:** Ensure webhook URL is HTTPS in production

### Issue: "Tap Payments is not configured"
**Fix:** Environment variable not loaded - redeploy

---

## 📱 SUPPORTED PAYMENT METHODS

Your current setup supports:

| Method | Code | Status |
|--------|------|--------|
| mada (Saudi) | mada | ✅ |
| Visa | visa | ✅ |
| Mastercard | mastercard | ✅ |
| Apple Pay | apple_pay | ✅ (if configured) |
| STC Pay | stcpay | ✅ |

---

## 📞 TAP SUPPORT

- **Email:** support@tap.company
- **Phone:** +966 11 205 9700
- **Live Chat:** Available in dashboard
- **Docs:** https://developers.tap.company

---

## ⚡ QUICK START (COPY & PASTE)

```bash
# 1. Navigate to project
cd FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen

# 2. Edit .env file
nano .env
# Or use VS Code: code .env

# 3. Update TAP_SECRET_KEY
# Save file

# 4. Test locally
npm run dev

# 5. Open browser to http://localhost:3000
# 6. Add product to cart
# 7. Click Tap Payments button
# 8. Complete test payment

# 9. Deploy when ready
shopify hydrogen deploy
```

---

## 🎉 SUCCESS CRITERIA

✅ **Test Payment Flow:**
1. Customer adds item to cart
2. Opens cart → sees "Pay with mada / Card / Apple Pay" button
3. Clicks button → redirected to Tap hosted page
4. Enters card details → payment processed
5. Redirected back to your site → success message shown
6. Order confirmation received

---

**Last Updated:** 2026-04-04  
**Next Action:** Update TAP_SECRET_KEY in .env file
