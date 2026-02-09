/**
 * Formé Haus Web Pixel - Adjust Attribution Tracking
 * 
 * Implements Ounass-style app attribution and event tracking:
 * - checkout_started: User initiates checkout
 * - checkout_completed: Purchase complete
 * - payment_info_submitted: Payment method selected
 * - product_added_to_cart: Add to cart events
 * 
 * Sends data to Adjust SDK for attribution analysis.
 */

// Adjust SDK Configuration
const ADJUST_CONFIG = {
  appToken: settings.adjust_app_token,
  environment: settings.adjust_environment || 'production',
  // Saudi Arabia timezone
  defaultTimezone: 'Asia/Riyadh',
};

// Initialize Adjust SDK
function initAdjust() {
  if (!settings.enable_attribution || !ADJUST_CONFIG.appToken) {
    return;
  }

  // Load Adjust Web SDK
  const script = document.createElement('script');
  script.src = 'https://cdn.adjust.com/adjust-5.3.0.min.js';
  script.async = true;
  script.onload = () => {
    window.Adjust.initSdk({
      appToken: ADJUST_CONFIG.appToken,
      environment: ADJUST_CONFIG.environment,
      // Disable auto-tracking, we'll send custom events
      disableAutoTracking: true,
    });
    
    // Log initialization for debugging
    console.log('[Adjust] SDK initialized');
  };
  document.head.appendChild(script);
}

// Event tracking functions
function trackAdjustEvent(eventToken, params = {}) {
  if (typeof window.Adjust === 'undefined') {
    console.warn('[Adjust] SDK not loaded');
    return;
  }

  const event = new window.Adjust.Event(eventToken);
  
  // Add custom parameters
  Object.keys(params).forEach(key => {
    event.addCallbackParameter(key, String(params[key]));
  });

  window.Adjust.trackEvent(event);
  console.log('[Adjust] Event tracked:', eventToken, params);
}

// Shopify Event Handlers
analytics.subscribe('checkout_started', (event) => {
  const { checkout } = event.data;
  
  trackAdjustEvent('checkout_started', {
    checkout_id: checkout.token,
    currency: checkout.currencyCode,
    value: checkout.totalPrice.amount,
    item_count: checkout.lineItems.length,
  });
});

analytics.subscribe('checkout_completed', (event) => {
  const { checkout, order } = event.data;
  
  // Track purchase - this is crucial for attribution
  trackAdjustEvent('purchase', {
    order_id: order.id,
    checkout_id: checkout.token,
    currency: checkout.currencyCode,
    revenue: checkout.totalPrice.amount,
    subtotal: checkout.subtotalPrice.amount,
    tax: checkout.totalTax.amount,
    shipping: checkout.shippingLine?.price?.amount || 0,
    item_count: checkout.lineItems.length,
    // Attribution data
    utm_source: checkout.attributes?.utm_source || '',
    utm_medium: checkout.attributes?.utm_medium || '',
    utm_campaign: checkout.attributes?.utm_campaign || '',
    // Customer info (anonymized)
    customer_id: checkout.customer?.id || 'guest',
    is_new_customer: checkout.customer?.isFirstOrder || false,
  });

  // Track for retargeting
  trackAdjustEvent('checkout_completed', {
    order_id: order.id,
    value: checkout.totalPrice.amount,
  });
});

analytics.subscribe('payment_info_submitted', (event) => {
  const { checkout, paymentMethod } = event.data;
  
  trackAdjustEvent('payment_info', {
    checkout_id: checkout.token,
    payment_method: paymentMethod.type,
    currency: checkout.currencyCode,
    value: checkout.totalPrice.amount,
  });
});

analytics.subscribe('product_added_to_cart', (event) => {
  const { cartLine, productVariant } = event.data;
  
  trackAdjustEvent('add_to_cart', {
    product_id: productVariant.product.id,
    variant_id: productVariant.id,
    product_name: productVariant.product.title,
    sku: productVariant.sku,
    price: productVariant.price.amount,
    currency: cartLine.cost.totalAmount.currencyCode,
    quantity: cartLine.quantity,
  });
});

analytics.subscribe('product_viewed', (event) => {
  const { productVariant } = event.data;
  
  trackAdjustEvent('product_view', {
    product_id: productVariant.product.id,
    variant_id: productVariant.id,
    product_name: productVariant.product.title,
    category: productVariant.product.type,
    price: productVariant.price.amount,
  });
});

analytics.subscribe('search_submitted', (event) => {
  const { searchResult } = event.data;
  
  trackAdjustEvent('search', {
    search_term: searchResult.query,
    results_count: searchResult.productVariants.length,
  });
});

// Custom event for app store redirects (Ounass-style)
analytics.subscribe('custom_event', (event) => {
  const { name, data } = event.data;
  
  if (name === 'app_store_redirect') {
    trackAdjustEvent('app_store_click', {
      platform: data.platform, // 'ios' or 'android'
      source: data.source || 'footer',
      campaign: data.campaign || 'organic',
    });
  }
  
  if (name === 'loyalty_redirect') {
    trackAdjustEvent('loyalty_click', {
      destination: data.destination || 'myamber.ae',
    });
  }
});

// Initialize on page load
initAdjust();

// Log pixel registration
console.log('[Formé Haus Web Pixel] Adjust tracking initialized');
