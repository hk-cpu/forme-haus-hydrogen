# Tap Payments - Technical Questions for Tap Team

**Pre-Launch Technical Review** | **Ask These Before Going Live**

---

## 🔑 API & Credentials

### Must Ask:

1. **"We need the production Secret Key (sk*live*). Is our account approved for live transactions?"**
2. **"What's the difference between Test and Live API keys? Do we need to change any API endpoints?"**
   - Current: `https://api.tap.company/v2` (same for both?)
3. **"Do you provide separate API keys for different environments (dev/staging/prod)?"**

4. **"Are there IP whitelisting requirements for our server?"**
   - Shopify Oxygen hosting IPs if needed

---

## 💳 Payment Methods

### Must Ask:

5. **"Which payment methods are activated on our account?"**

   - mada (Saudi domestic cards) - REQUIRED
   - Visa/Mastercard international
   - Apple Pay
   - STC Pay
   - Tabby/Tamara (Buy Now Pay Later)

6. **"Is mada processing enabled for our merchant account?"**

   - Critical for Saudi market
   - Any special requirements?

7. **"What's the timeline for enabling Apple Pay?"**

   - Requires additional verification?
   - Domain verification needed?

8. **"Are there any restrictions on card types or issuing countries?"**

---

## 🔐 3D Secure & Security

### Must Ask:

9. **"Is 3D Secure mandatory for all transactions?"**

   - Current code has `threeDSecure: true`
   - What about low-value transactions?

10. **"What's your 3D Secure flow? Will customers see OTP on our site or redirected to bank?"**

11. **"Do you handle 3DS2 (frictionless flow) or only 3DS1?"**

12. **"Are there specific requirements for PCI compliance since we use your hosted page?"**
    - We redirect to Tap, don't handle cards directly

---

## 🔄 Webhooks & Notifications

### Must Ask:

13. **"What webhook events should we subscribe to?"**

    - charge.captured
    - charge.failed
    - charge.cancelled
    - charge.refunded
    - charge.initiated

14. **"What's the webhook retry policy?"**

    - How many retries?
    - Retry intervals?
    - What if our server is down?

15. **"Do you send webhook signatures for verification?"**

    - Current code doesn't verify signatures
    - Should we implement this?

16. **"What's the webhook timeout? Our server must respond within \_\_\_ seconds?"**

17. **"Can we configure multiple webhook URLs for different environments?"**

---

## 💰 Transaction Limits & Fees

### Must Ask:

18. **"What are the transaction limits per payment?"**

    - Minimum: \_\_\_ SAR
    - Maximum: \_\_\_ SAR
    - Daily limits for customers?

19. **"What are your fees per transaction?"**

    - mada: \_\_\_%
    - Visa/Mastercard: \_\_\_%
    - International cards: \_\_\_%
    - Fixed fee per transaction?

20. **"Are there any monthly fees or setup costs?"**

21. **"What's the refund policy? Can we refund partial amounts?"**
    - Time limit for refunds?
    - Refund fees?

---

## ⏱️ Settlement & Payouts

### Must Ask:

22. **"What's the settlement timeline?"**

    - T+1? T+2? T+7?
    - When do we receive money in our bank account?

23. **"What's the settlement currency?"**

    - SAR only?
    - Auto-conversion for international cards?

24. **"Do you offer instant/settlement or standard?"**

25. **"What bank account details do you need for settlements?"**
    - IBAN?
    - Bank name?
    - Account holder name?

---

## 🛠️ Technical Integration

### Must Ask:

26. **"Our redirect URL format is: `https://formehaus.me/tap/callback?tap_id={charge_id}` - is this correct?"**

27. **"What parameters do you send to the callback URL?"**

    - tap_id
    - status
    - Anything else?

28. **"What's the difference between Redirect URL and Webhook URL?"**

    - When is each triggered?

29. **"Do you support idempotency keys to prevent duplicate charges?"**

    - We generate merchantTransactionId

30. **"What's the API rate limit? Requests per second/minute?"**

31. **"Do you have a sandbox/test environment that mirrors production exactly?"**

---

## 🚨 Error Handling & Edge Cases

### Must Ask:

32. **"What error codes should we handle?"**

    - Insufficient funds
    - Card expired
    - 3DS failed
    - Transaction declined
    - Timeout errors

33. **"What happens if a customer closes the browser during payment?"**

    - Webhook still sent?
    - How to recover?

34. **"How long is a charge valid before expiring?"**

    - Customer has \_\_\_ minutes to complete?

35. **"Can customers retry a failed payment on the same charge?"**

36. **"What happens if we get a timeout from your API? Should we retry?"**

---

## 📞 Support & SLA

### Must Ask:

37. **"What's your technical support availability?"**

    - 24/7?
    - Business hours?
    - Emergency contact?

38. **"What's your API uptime SLA?"**

39. **"Do you have a status page for monitoring outages?"**

    - URL: \***\*\_\_\_\*\***

40. **"Who do we contact for urgent issues during launch?"**
    - Email: \***\*\_\_\_\*\***
    - Phone: \***\*\_\_\_\*\***
    - WhatsApp: \***\*\_\_\_\*\***

---

## 🔍 Testing & Go-Live

### Must Ask:

41. **"What final checks do you recommend before going live?"**

42. **"Can you verify our integration is correct before we switch to live mode?"**

    - Share our implementation details

43. **"Do you have a pre-launch checklist we should complete?"**

44. **"What's the process to switch from Test to Live mode?"**

    - Just change API key?
    - Any approval needed?

45. **"Can we do a small live transaction test (1 SAR) before full launch?"**

---

## 📋 Additional Requirements

### Must Ask:

46. **"Do you require any legal documents or compliance certificates on our website?"**

    - Terms & Conditions
    - Privacy Policy
    - Refund Policy

47. **"Are there specific checkout page requirements we must display?"**

    - Security logos?
    - Terms acceptance?

48. **"Do you require transaction descriptors on customer statements?"**

    - What will customers see? "FORMEHAUS" or something else?

49. **"Are there prohibited products or business categories?"**

    - We're selling fashion/accessories - any issues?

50. **"What's your chargeback/dispute process?"**
    - How are we notified?
    - Response timeframe?
    - Fees?

---

## ✅ POST-CALL ACTION ITEMS

After speaking with Tap team, document:

- [ ] Production API Key received: `sk_live_`\***\*\_\_\*\***
- [ ] Webhook events confirmed
- [ ] Settlement timeline confirmed: T+\_\_\_
- [ ] Fees confirmed: \_\_\_%
- [ ] Support contact saved
- [ ] Go-live approval received
- [ ] Test transaction completed successfully

---

## 📞 TAP CONTACT INFORMATION

**Support Channels:**

- Email: support@tap.company
- Website: https://tap.company
- Dashboard: https://dashboard.tap.company

**Prepare for the call:**

- Merchant Account ID ready
- Business license number
- Website URL: formehaus.me
- Expected transaction volume (daily/monthly)

---

**Call them NOW if you haven't already! 📞**
