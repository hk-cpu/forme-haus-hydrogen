# How to Get Storefront API Token (Correct Way)

## The Problem

You provided: `[REDACTED]`

This is a **Private App Admin API Token** - it won't work for Storefront API.

## What You Need

A **Storefront Access Token** from a Custom App (not Private App).

## Step-by-Step

### 1. Go to Right Place
Open: https://admin.shopify.com/store/f0c5au-jn/settings/apps/development

### 2. Create Custom App
1. Click **"Create an app"**
2. Name: `Forme Haus Storefront`Environment variables
PRIVATE_STOREFRONT_API_TOKEN
[REDACTED]
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
a5be9e0d-b1f3-4489-851d-6b58785e254f
PUBLIC_CUSTOMER_ACCOUNT_API_URL
https://shopify.com/74408657067
PUBLIC_STORE_DOMAIN
f0c5au-jn.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN
[REDACTED]
PUBLIC_STOREFRONT_ID
1000082807
SESSION_SECRET
[REDACTED]
SHOP_ID
74408657067
3. Click **"Create app"**

### 3. Configure API Scopes
1. Click **"Configure"** next to **Storefront API integration**
2. Enable these scopes:
   - ☑ `read_product_listings`
   - ☑ `read_product_inventory`
   - ☑ `read_product_tags`
   - ☑ `read_customers`
   - ☑ `write_customers`
   - ☑ `read_checkouts`
   - ☑ `write_checkouts`
   - ☑ `read_selling_plans`
   - ☑ `read_delivery_customizations`
3. Click **Save**

### 4. Install App
1. Click **"Install app"** button (top right)
2. Click **"Install"** to confirm

### 5. Get Token
After installing, you'll see:

**Storefront access token**
```
[REDACTED]
```

☝️ **This is what you need!**

It should be:
- 32 characters
- All lowercase letters and numbers
- NO `shpat_` prefix
- Different from your Admin API token

### 6. Copy & Paste Here

Copy that token and paste it in your next message.

---

## Visual Guide

```
Shopify Admin
    ↓
Settings → Apps and sales channels → Develop apps
    ↓
"Create an app" → Name it → Create
    ↓
Configuration tab → Storefront API → Configure
    ↓
Enable all scopes → Save
    ↓
Install app → Reveal token → COPY
    ↓
Paste here!
```

---

## Important Distinction

| Token Type | Format | Use For |
|------------|--------|---------|
| **Admin API** | `shpat_xxxxxxxx...` | Managing products, orders, customers |
| **Storefront API** | `xxxxxxxx...` (32 chars) | Displaying products, cart, checkout |

You need **Storefront API** for Hydrogen!

---

## Common Mistake

❌ Using Private App Admin token (`shpat_...`)
✅ Using Custom App Storefront token (`a59f1cae...`)

---

**Ready? Get the token and paste it below!**
