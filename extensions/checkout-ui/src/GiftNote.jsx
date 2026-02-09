/**
 * GiftNote - Checkout UI Extension
 * 
 * Target: purchase.checkout.footer.render-after
 * Features:
 * - Gift message textarea
 * - Gift wrapping option
 * - Saves to Order Metafields
 */

import React, { useState, useCallback } from 'react';
import {
  useApi,
  reactExtension,
  TextArea,
  Checkbox,
  BlockStack,
  View,
  Heading,
  Text,
  InlineLayout,
  Icon,
} from '@shopify/ui-extensions-react/checkout';

const GiftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2.5 2.5v5" />
    <path d="M16.5 8v-2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-2.5 2.5h-5" />
  </svg>
);

export default reactExtension('purchase.checkout.footer.render-after', () => <GiftNote />);

function GiftNote() {
  const { applyAttributeChange } = useApi();
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [includeReceipt, setIncludeReceipt] = useState(false);
  const MAX_MESSAGE_LENGTH = 150;

  const handleGiftToggle = useCallback((checked) => {
    setIsGift(checked);
    applyAttributeChange({
      key: 'is_gift',
      type: 'updateAttribute',
      value: checked ? 'true' : 'false',
    });
  }, [applyAttributeChange]);

  const handleMessageChange = useCallback((value) => {
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setGiftMessage(value);
      applyAttributeChange({
        key: 'gift_message',
        type: 'updateAttribute',
        value: value,
      });
    }
  }, [applyAttributeChange]);

  const handleReceiptToggle = useCallback((checked) => {
    setIncludeReceipt(checked);
    applyAttributeChange({
      key: 'include_gift_receipt',
      type: 'updateAttribute',
      value: checked ? 'true' : 'false',
    });
  }, [applyAttributeChange]);

  return (
    <View border="base" padding="base" cornerRadius="base">
      <BlockStack spacing="base">
        <InlineLayout spacing="tight" columns={['auto', 'fill']}>
          <Icon source={GiftIcon} size="base" />
          <Heading level={3}>Gift Options</Heading>
        </InlineLayout>

        <Checkbox
          checked={isGift}
          onChange={handleGiftToggle}
        >
          This order is a gift
        </Checkbox>

        {isGift && (
          <BlockStack spacing="base">
            <TextArea
              label="Gift Message"
              value={giftMessage}
              onChange={handleMessageChange}
              placeholder="Enter your personalized gift message..."
              maxLength={MAX_MESSAGE_LENGTH}
            />
            
            <View inlineAlignment="end">
              <Text appearance="subdued" size="small">
                {giftMessage.length}/{MAX_MESSAGE_LENGTH} characters
              </Text>
            </View>

            <Checkbox
              checked={includeReceipt}
              onChange={handleReceiptToggle}
            >
              Include gift receipt (prices hidden)
            </Checkbox>
          </BlockStack>
        )}
      </BlockStack>
    </View>
  );
}
