import { Form } from '@remix-run/react';
import type { CustomerAddress } from '@shopify/hydrogen/customer-account-api-types';

import type { CustomerDetailsFragment } from 'customer-accountapi.generated';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { Link } from '~/components/Link';

export function AccountAddressBook({
  customer,
  addresses,
}: {
  customer: CustomerDetailsFragment;
  addresses: CustomerAddress[];
}) {
  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12 border-t border-[#F0EAE6]/10">
        <h3 className="font-serif text-[#F0EAE6] text-2xl mb-6">Address Book</h3>
        <div>
          {!addresses?.length && (
            <Text className="mb-1 text-[#F0EAE6]/60" width="narrow" as="p" size="copy">
              You haven&apos;t saved any addresses yet.
            </Text>
          )}
          <div className="w-48">
            <Button
              to="address/add"
              className="mt-2 text-sm w-full mb-6"
              variant="secondary"
            >
              Add an Address
            </Button>
          </div>
          {Boolean(addresses?.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customer.defaultAddress && (
                <Address address={customer.defaultAddress} defaultAddress />
              )}
              {addresses
                .filter((address) => address.id !== customer.defaultAddress?.id)
                .map((address) => (
                  <Address key={address.id} address={address} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: CustomerAddress;
  defaultAddress?: boolean;
}) {
  return (
    <div className="lg:p-8 p-6 bg-[#121212]/30 backdrop-blur-sm border border-[#F0EAE6]/10 rounded-sm flex flex-col transition-all hover:bg-[#121212]/50">
      {defaultAddress && (
        <div className="mb-3 flex flex-row">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-medium rounded-full bg-[#C4A484]/20 text-[#C4A484] border border-[#C4A484]/20">
            Default
          </span>
        </div>
      )}
      <ul className="flex-1 flex-row text-[#F0EAE6]/80 text-sm leading-relaxed font-sans">
        {(address.firstName || address.lastName) && (
          <li className="font-medium text-[#F0EAE6] mb-2 uppercase tracking-wide text-xs">
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="flex flex-row font-medium mt-6 items-baseline gap-6">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left text-[#C4A484] hover:text-[#F0EAE6] text-xs uppercase tracking-widest transition-colors"
          prefetch="intent"
        >
          Edit
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-[#F0EAE6]/40 hover:text-red-400 ml-6 text-xs uppercase tracking-widest transition-colors">
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}
