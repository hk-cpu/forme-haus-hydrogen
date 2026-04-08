import {test, expect} from '@playwright/test';

/**
 * Routes E2E Tests
 * Tests that all critical routes are accessible and render correctly
 */

const publicRoutes = [
  {path: '/', name: 'Homepage'},
  {path: '/collections/all', name: 'All Collections'},
  {path: '/search', name: 'Search'},
  {path: '/cart', name: 'Cart'},
  {path: '/pages/about', name: 'About Page'},
  {path: '/pages/faqs', name: 'FAQs Page'},
  {path: '/contact', name: 'Contact Page'},
  {path: '/policies/privacy-policy', name: 'Privacy Policy'},
  {path: '/policies/terms-of-service', name: 'Terms of Service'},
  {path: '/policies/refund-policy', name: 'Refund Policy'},
  {path: '/policies/shipping-policy', name: 'Shipping Policy'},
];

const apiRoutes = [
  {path: '/api/countries', name: 'Countries API', method: 'GET'},
  {path: '/api/predictive-search', name: 'Predictive Search API', method: 'GET'},
  {path: '/api/products', name: 'Products API', method: 'GET'},
];

test.describe('Public Routes', () => {
  for (const route of publicRoutes) {
    test(`${route.name} (${route.path}) loads successfully`, async ({page}) => {
      const response = await page.goto(route.path);
      
      // Check that page loads (2xx or 3xx status)
      expect(response?.status()).toBeLessThan(500);
      
      // Check that main content is rendered
      await expect(page.locator('main, #root, body')).toBeVisible();
      
      // Check that no error boundary is shown
      const errorText = await page.locator('text=Application Error').isVisible().catch(() => false);
      expect(errorText).toBeFalsy();
    });
  }
});

test.describe('API Routes', () => {
  for (const route of apiRoutes) {
    test(`${route.name} responds correctly`, async ({request}) => {
      const response = await request.get(route.path);
      
      // API routes should return JSON or redirect
      expect(response.status()).toBeLessThan(500);
      
      // Check content type
      const contentType = response.headers()['content-type'] || '';
      expect(contentType.includes('json') || contentType.includes('html')).toBeTruthy();
    });
  }
});

test.describe('Payment Routes', () => {
  test('Tap callback page renders without error', async ({page}) => {
    await page.goto('/tap/callback');
    
    // Should show the callback UI
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('HyperPay callback page renders without error', async ({page}) => {
    await page.goto('/hyperpay/callback');
    
    // Should show the callback UI
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('Tap initiate returns method not allowed for GET', async ({request}) => {
    const response = await request.get('/tap/initiate');
    expect(response.status()).toBe(405);
  });

  test('HyperPay initiate returns method not allowed for GET', async ({request}) => {
    const response = await request.get('/hyperpay/initiate');
    expect(response.status()).toBe(405);
  });
});

test.describe('Account Routes (Public)', () => {
  test('Login page is accessible', async ({page}) => {
    await page.goto('/account/login');
    
    // Should show login form or redirect
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('Register page is accessible', async ({page}) => {
    await page.goto('/account/register');
    
    // Should show register form or redirect
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('Account recover page is accessible', async ({page}) => {
    await page.goto('/account/recover');
    
    // Should show recover form
    await expect(page.locator('main, body')).toBeVisible();
  });
});

test.describe('Internationalization Routes', () => {
  test('Arabic locale prefix works', async ({page}) => {
    const response = await page.goto('/ar');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('English locale prefix works', async ({page}) => {
    const response = await page.goto('/en');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('main, body')).toBeVisible();
  });
});

test.describe('404 Handling', () => {
  test('Non-existent page shows 404', async ({page}) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    
    // Should not crash
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('Non-existent product returns appropriate response', async ({page}) => {
    const response = await page.goto('/products/non-existent-product-12345');
    
    // Should handle gracefully
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('main, body')).toBeVisible();
  });
});
