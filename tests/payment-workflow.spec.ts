import {test, expect} from '@playwright/test';

/**
 * Payment Workflow E2E Tests
 * Tests the complete payment flow including Tap Payments integration
 */

test.describe('Payment Workflow', () => {
  test('Cart page has payment options', async ({page}) => {
    await page.goto('/');
    
    // Navigate to a product and add to cart
    const productLink = page.locator('main a[href*="/products/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();
    
    // Wait for product page
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    
    // Add to cart
    await page.locator('[data-test="add-to-cart"]').click();
    
    // Wait for cart to open
    await expect(page.locator('text=Proceed to Checkout')).toBeVisible();
    
    // Check for Tap Payments button
    await expect(page.locator('text=Pay with mada / Card / Apple Pay')).toBeVisible();
    
    // Check for Shop Pay
    await expect(page.locator('[data-testid="shop-pay-button"]').or(page.locator('text=Shop Pay'))).toBeVisible();
    
    // Check for payment badges
    await expect(page.locator('text=mada')).toBeVisible();
  });

  test('Tap Payments initiate endpoint exists', async ({request}) => {
    // Test that the initiate endpoint returns proper error for GET (should be POST)
    const response = await request.get('/tap/initiate');
    expect(response.status()).toBe(405); // Method not allowed
  });

  test('Tap Payments callback endpoint renders UI', async ({page}) => {
    // Test callback page with mock error state
    await page.goto('/tap/callback');
    
    // Should show error state when no payment reference
    await expect(page.locator('text=Payment Unsuccessful').or(page.locator('text=No payment reference'))).toBeVisible();
  });

  test('HyperPay initiate endpoint exists', async ({request}) => {
    const response = await request.get('/hyperpay/initiate');
    expect(response.status()).toBe(405); // Method not allowed
  });
});

test.describe('Checkout Flow', () => {
  test('Complete checkout navigation works', async ({page}) => {
    test.setTimeout(60000);
    
    // Start at home
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    
    // Navigate to collections
    await page.goto('/collections/all');
    await expect(page.locator('h1').or(page.locator('main'))).toBeVisible();
    
    // Navigate to cart
    await page.goto('/cart');
    await expect(page.locator('main')).toBeVisible();
  });

  test('Shopify checkout redirect works', async ({page}) => {
    test.setTimeout(60000);
    
    await page.goto('/');
    
    // Find and click first product
    const productLink = page.locator('main a[href*="/products/"]').first();
    if (await productLink.isVisible().catch(() => false)) {
      await productLink.click();
      
      // Add to cart
      const addButton = page.locator('[data-test="add-to-cart"]');
      if (await addButton.isVisible().catch(() => false)) {
        await addButton.click();
        
        // Click checkout
        const checkoutButton = page.locator('text=Proceed to Checkout');
        if (await checkoutButton.isVisible().catch(() => false)) {
          await checkoutButton.click();
          
          // Should redirect to checkout domain
          await expect(page).toHaveURL(/checkout\.(formehaus\.me|hydrogen\.shop)/);
        }
      }
    }
  });
});
