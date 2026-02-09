/**
 * DeliveryInstructions - Checkout UI Extension
 * 
 * Target: purchase.checkout.address.render-before
 * Features:
 * - Saudi National Address short code lookup
 * - Delivery instructions textarea with character counter
 * - Building/Unit number fields
 * - Integration with Saudi Address API
 */

import React, { useState, useCallback } from 'react';
import {
  useApi,
  useSubscription,
  reactExtension,
  TextArea,
  TextField,
  InlineLayout,
  BlockStack,
  View,
  Heading,
  Button,
  SkeletonText,
  SkeletonTextField,
  Icon,
} from '@shopify/ui-extensions-react/checkout';

// SVG Icons as components for checkout UI
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// React Extension wrapper
export default reactExtension('purchase.checkout.address.render-before', () => <DeliveryInstructions />);

function DeliveryInstructions() {
  const { extension, storage, applyAttributeChange } = useApi();
  const [nationalAddressCode, setNationalAddressCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 200;

  // Character counter handler
  const handleInstructionsChange = useCallback((value) => {
    if (value.length <= MAX_CHARS) {
      setDeliveryInstructions(value);
      setCharCount(value.length);
      
      // Save to metafields
      applyAttributeChange({
        key: 'delivery_instructions',
        type: 'updateAttribute',
        value: value,
      });
    }
  }, [applyAttributeChange]);

  // Saudi National Address Lookup
  const handleAddressLookup = useCallback(async () => {
    if (!nationalAddressCode || nationalAddressCode.length < 4) return;
    
    setIsSearching(true);
    
    try {
      // Saudi National Address API integration
      // Format: https://api.address.gov.sa/v1/addresses/{shortCode}
      const response = await fetch(
        `https://api.address.gov.sa/v1/addresses/${nationalAddressCode}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Auto-fill address fields
        if (data.address) {
          await applyAttributeChange({
            key: 'address1',
            type: 'updateAttribute',
            value: `${data.address.buildingName || ''} - ${data.address.streetName || ''}`,
          });
          
          await applyAttributeChange({
            key: 'city',
            type: 'updateAttribute',
            value: data.address.city || '',
          });
          
          await applyAttributeChange({
            key: 'zip',
            type: 'updateAttribute',
            value: data.address.postalCode || '',
          });
        }
      }
    } catch (error) {
      console.error('National Address lookup failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [nationalAddressCode, applyAttributeChange]);

  return (
    <BlockStack spacing="loose">
      {/* National Address Lookup */}
      <View border="base" padding="base" cornerRadius="base">
        <BlockStack spacing="tight">
          <InlineLayout spacing="tight" columns={['auto', 'fill']}>
            <Icon source={LocationIcon} size="base" />
            <Heading level={3}>Saudi National Address</Heading>
          </InlineLayout>
          
          <InlineLayout spacing="tight" columns={['fill', 'auto']}>
            <TextField
              label="Short Code (4 digits)"
              value={nationalAddressCode}
              onChange={setNationalAddressCode}
              placeholder="Enter 4-digit code"
              maxLength={4}
            />
            <Button
              onPress={handleAddressLookup}
              loading={isSearching}
              accessibilityLabel="Search address"
            >
              <Icon source={SearchIcon} size="small" />
            </Button>
          </InlineLayout>
        </BlockStack>
      </View>

      {/* Building & Unit Numbers */}
      <InlineLayout spacing="base" columns={['50%', '50%']}>
        <TextField
          label="Building Number"
          value={buildingNumber}
          onChange={(value) => {
            setBuildingNumber(value);
            applyAttributeChange({
              key: 'building_number',
              type: 'updateAttribute',
              value: value,
            });
          }}
          placeholder="Bldg #"
        />
        <TextField
          label="Unit/Flat Number"
          value={unitNumber}
          onChange={(value) => {
            setUnitNumber(value);
            applyAttributeChange({
              key: 'unit_number',
              type: 'updateAttribute',
              value: value,
            });
          }}
          placeholder="Unit #"
        />
      </InlineLayout>

      {/* Delivery Instructions with Character Counter */}
      <View>
        <BlockStack spacing="tight">
          <TextArea
            label="Delivery Instructions (Optional)"
            value={deliveryInstructions}
            onChange={handleInstructionsChange}
            placeholder="Add any special instructions for delivery (e.g., leave at reception, call before delivery)"
            maxLength={MAX_CHARS}
          />
          <View inlineAlignment="end">
            <Text appearance="subdued" size="small">
              {charCount}/{MAX_CHARS}
            </Text>
          </View>
        </BlockStack>
      </View>
    </BlockStack>
  );
}
