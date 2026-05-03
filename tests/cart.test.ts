import {test, expect} from '@playwright/test';

import {formatPrice, normalizePrice} from './utils';

test.describe('Cart', () => {
  test('From home to checkout flow', async ({page}) => {
    test.setTimeout(60000); // Increase timeout to 1 minute

    // Home => New In => First product
    await page.goto(`/collections/new-in`);

    // Wait for navigation to be ready
    await page.waitForSelector('main', {timeout: 15000});
    await page.locator(`main a[href*="/products/"]`).first().click();

    const firstItemPrice = normalizePrice(
      await page.locator(`[data-test=price]`).textContent(),
    );

    await page.locator(`[data-test=add-to-cart]`).click();

    await expect(
      page.locator('[data-test=subtotal]'),
      'should show the correct price',
    ).toContainText(formatPrice(firstItemPrice));

    // Add an extra unit by increasing quantity
    await page
      .locator('button[aria-label="Increase quantity"]')
      .click({delay: 300});

    await expect(
      page.locator('[data-test=subtotal]'),
      'should double the price',
    ).toContainText(formatPrice(2 * firstItemPrice));

    await expect(
      page.locator('[data-test=item-quantity]'),
      'should increase quantity',
    ).toContainText('2');

    // Close cart drawer => Phone Cases => First product
    await page.locator('[data-test=close-cart]').click();

    // Wait for cart to close
    await expect(page.locator('[data-test=cart-drawer]')).not.toBeVisible();

    // Navigate to phone cases
    await page.goto('/collections/phone-cases');
    await page.waitForSelector('main', {timeout: 15000});
    await page.locator(`main a[href*="/products/"]`).first().click();

    const secondItemPrice = normalizePrice(
      await page.locator(`[data-test=price]`).textContent(),
    );

    // Add another unit by adding to cart the same item
    await page.locator(`[data-test=add-to-cart]`).click();

    await expect(
      page.locator('[data-test=subtotal]'),
      'should add the price of the second item',
    ).toContainText(formatPrice(2 * firstItemPrice + secondItemPrice));

    const quantities = await page
      .locator('[data-test=item-quantity]')
      .allTextContents();
    await expect(
      quantities.reduce((a, b) => Number(a) + Number(b), 0),
      'should have the correct item quantities',
    ).toEqual(3);

    const priceInStore = await page
      .locator('[data-test=subtotal]')
      .textContent();

    // Verify checkout button is visible and links to the checkout path
    const checkoutBtn = page.locator('[data-test=checkout-btn]');
    await expect(checkoutBtn).toBeVisible();
    const href = await checkoutBtn.getAttribute('href');
    expect(href, 'checkout button should link to /checkout').toMatch(/checkout/);
  });
});
