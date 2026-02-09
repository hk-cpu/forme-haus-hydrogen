/**
 * PaymentBanners - Checkout UI Extension
 * 
 * Target: purchase.checkout.payment-method-list.render-after
 * Features:
 * - Tabby BNPL banner
 * - Tamara BNPL banner
 * - Apple Pay / Google Pay promotion
 * - Dynamic messaging based on cart total
 */

import React from 'react';
import {
  useApi,
  useSubscription,
  reactExtension,
  Banner,
  BlockStack,
  View,
  Text,
  InlineLayout,
  Image,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.payment-method-list.render-after', () => <PaymentBanners />);

function PaymentBanners() {
  const { cost } = useApi();
  const totalAmount = useSubscription(cost?.totalAmount?.amount) || 0;
  const currencyCode = useSubscription(cost?.totalAmount?.currencyCode) || 'SAR';

  // Calculate installment amounts
  const tabbyInstallment = (totalAmount / 4).toFixed(2);
  const tamaraInstallment = (totalAmount / 3).toFixed(2);

  return (
    <BlockStack spacing="base">
      {/* Tabby Banner */}
      {totalAmount >= 100 && totalAmount <= 3000 && (
        <View background="subdued" padding="base" cornerRadius="base">
          <InlineLayout spacing="tight" columns={['auto', 'fill']}>
            <View
              background="base"
              padding="tight"
              cornerRadius="tight"
              inlineSize={60}
              blockSize={30}
            >
              <Text size="small" emphasis="bold">tabby</Text>
            </View>
            <BlockStack spacing="none">
              <Text size="small">
                Pay in 4 interest-free payments of <Text emphasis="bold">{tabbyInstallment} {currencyCode}</Text>
              </Text>
              <Text size="extraSmall" appearance="subdued">
                No fees. Sharia-compliant.
              </Text>
            </BlockStack>
          </InlineLayout>
        </View>
      )}

      {/* Tamara Banner */}
      {totalAmount >= 100 && totalAmount <= 5000 && (
        <View background="subdued" padding="base" cornerRadius="base">
          <InlineLayout spacing="tight" columns={['auto', 'fill']}>
            <View
              background="base"
              padding="tight"
              cornerRadius="tight"
              inlineSize={60}
              blockSize={30}
            >
              <Text size="small" emphasis="bold" appearance="critical">tamara</Text>
            </View>
            <BlockStack spacing="none">
              <Text size="small">
                Pay in 3 payments of <Text emphasis="bold">{tamaraInstallment} {currencyCode}</Text>
              </Text>
              <Text size="extraSmall" appearance="subdued">
                No interest. No hidden fees.
              </Text>
            </BlockStack>
          </InlineLayout>
        </View>
      )}

      {/* Apple Pay / Google Pay Banner */}
      <Banner status="info">
        <Text size="small">
          💳 For faster checkout, use Apple Pay or Google Pay
        </Text>
      </Banner>

      {/* Security Badge */}
      <View inlineAlignment="center">
        <InlineLayout spacing="base">
          <Text size="extraSmall" appearance="subdued">
            🔒 SSL Secure Payment
          </Text>
          <Text size="extraSmall" appearance="subdued">
            ✅ PCI DSS Compliant
          </Text>
        </InlineLayout>
      </View>
    </BlockStack>
  );
}
