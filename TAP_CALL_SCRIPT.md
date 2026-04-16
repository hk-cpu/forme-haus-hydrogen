# Tap Payments - Call Script for Tech Team

**Use this during your call with Tap** | **Priority Questions First**

---

## 📞 CALL OPENING

**"Hi, I'm [Name] from Forme Haus (formehaus.me). We're launching our Shopify Hydrogen storefront tomorrow and need to verify our Tap Payments integration before going live. Can you connect me with a technical specialist?"**

**Your Info:**

- Business: Forme Haus
- Website: https://formehaus.me
- Platform: Shopify Hydrogen (headless)
- Launch: Tomorrow
- Account Email: [your email]

---

## 🔥 TOP 10 CRITICAL QUESTIONS (Ask First!)

### 1. LIVE API KEY

**"Is our account approved for live transactions? We need the production Secret Key (sk*live*)."**

→ Get the key or find out what's needed for approval

---

### 2. MADA ACTIVATION

**"Is mada processing enabled? This is critical for our Saudi customers."**

→ Confirm mada is active

---

### 3. WEBHOOK EVENTS

**"Which webhook events should we subscribe to for charge status updates?"**

→ Recommended list:

- charge.captured
- charge.failed
- charge.cancelled

---

### 4. SETTLEMENT TIMELINE

**"What's the settlement time? T+1, T+2, or T+7?"**

→ Know when you'll receive money

---

### 5. TRANSACTION LIMITS

**"What are the min/max transaction limits? Any daily caps?"**

→ Min: usually 1 SAR
→ Max: usually 50,000-100,000 SAR

---

### 6. REDIRECT URL FORMAT

**"We redirect to: `https://formehaus.me/tap/callback?tap_id={charge_id}` - is this format correct?"**

→ Confirm your callback URL works

---

### 7. FEES STRUCTURE

**"What are the exact fees per payment method?"**

→ mada: **_%
→ Visa/Mastercard: _**%
→ Any monthly fees?

---

### 8. 3D SECURE

**"Is 3D Secure mandatory? We have threeDSecure: true in our code."**

→ Confirm if this should always be on

---

### 9. ERROR CODES

**"What are the main error codes we should handle for declined payments?"**

→ Get list of common errors

---

### 10. EMERGENCY CONTACT

**"Who do we contact if there's an issue during launch tomorrow?"**

→ Get direct phone/WhatsApp for urgent issues

---

## 📋 IF ACCOUNT NOT APPROVED YET

Ask:
**"What do you need to approve our account today? We launch tomorrow."**

Possible requirements:

- [ ] Business license upload
- [ ] ID verification
- [ ] Website review
- [ ] Terms & Conditions page
- [ ] Privacy Policy page
- [ ] Refund Policy page

**"Can we get temporary approval for test transactions while documents are processed?"**

---

## 🔧 TECHNICAL VERIFICATION

Share your setup and ask for confirmation:

**"Let me confirm our integration is correct:"**

1. **"We POST to /v2/charges with:"**

   - amount, currency (SAR)
   - source.id: "src_all"
   - redirect.url: our callback
   - post.url: our webhook

   **"Is this correct?"**

2. **"You redirect customer to transaction.url"**
   **"Then redirect back to our callback with tap_id"**
   **"Plus webhook to our webhook URL"**

   **"Is this flow correct?"**

3. **"We verify payment status by GET /v2/charges/{id}"**

   **"Is this the right way to confirm?"**

---

## 🧪 PRE-LAUNCH TEST REQUEST

**"Can you help us verify our integration works before tomorrow?"**

Ask them to:

- [ ] Verify our webhook URL is reachable
- [ ] Check our API requests format
- [ ] Confirm callback URL format
- [ ] Send a test webhook event

---

## 📧 EMAIL TEMPLATE (If Can't Call)

```
Subject: URGENT: Pre-Launch Technical Review - Forme Haus (Launch Tomorrow)

Dear Tap Support Team,

We're launching our Shopify Hydrogen storefront tomorrow and need urgent
assistance with our Tap Payments integration.

BUSINESS DETAILS:
- Company: Forme Haus
- Website: https://formehaus.me
- Email: [your-email]
- Platform: Shopify Hydrogen (Headless)
- Launch Date: Tomorrow

URGENT REQUESTS:
1. Verify our account is approved for live transactions
2. Provide production API key (sk_live_)
3. Confirm mada is enabled
4. Verify our webhook/callback URLs are correct
5. Provide emergency contact for launch day

TECHNICAL SETUP:
- Callback URL: https://formehaus.me/tap/callback
- Webhook URL: https://formehaus.me/tap/webhook
- API Endpoint: https://api.tap.company/v2
- Currency: SAR
- Source: src_all (all payment methods)

Please call me urgently at [YOUR PHONE] or reply to this email.

Thank you,
[Your Name]
[Your Position]
Forme Haus
```

---

## ✅ END OF CALL CHECKLIST

Before hanging up, confirm:

- [ ] Got live API key OR knows when it will be ready
- [ ] Confirmed mada is enabled
- [ ] Confirmed webhook/callback URLs are correct
- [ ] Know settlement timeline
- [ ] Know transaction fees
- [ ] Have emergency contact number/WhatsApp
- [ ] Know what to do if transactions fail

---

## 🆘 IF THEY CAN'T HELP TODAY

Ask:
**"Who can help us urgently? Can you escalate to a supervisor?"**

**"Can we use test mode for launch while live approval is pending?"**

Alternative:

- Use Shopify Payments as primary
- Add Tap as backup payment method
- Switch to Tap once approved

---

## 📱 TAP CONTACT INFO

**Primary:** support@tap.company
**Phone:** +966 11 205 9700
**WhatsApp:** [Check their website]
**Dashboard:** https://dashboard.tap.company

**Best time to call:** Sunday-Thursday, 9 AM - 6 PM KSA time

---

**MAKE THIS CALL NOW! ⏰**

Don't wait until tomorrow - call today!
