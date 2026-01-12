import type { CustomerDetailsFragment } from 'customer-accountapi.generated';
import { Link } from '~/components/Link';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const { firstName, lastName, emailAddress, phoneNumber } = customer;

  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-serif text-[#F0EAE6] text-2xl mb-4">Account Details</h3>
        <div className="lg:p-8 p-6 bg-[#121212]/30 backdrop-blur-sm border border-[#F0EAE6]/10 rounded-sm">
          <div className="flex items-baseline border-b border-[#F0EAE6]/10 pb-4 mb-4">
            <h3 className="font-medium text-[#F0EAE6] flex-1 text-sm uppercase tracking-widest">Profile</h3>
            <Link
              prefetch="intent"
              className="text-[#C4A484] hover:text-[#F0EAE6] text-xs uppercase tracking-widest transition-colors"
              to="/account/edit"
            >
              Edit
            </Link>
          </div>
          <div className="mt-4 text-xs text-[#F0EAE6]/50 uppercase tracking-widest">Name</div>
          <p className="mt-1 text-[#F0EAE6]">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : 'Add name'}{' '}
          </p>

          <div className="mt-4 text-xs text-[#F0EAE6]/50 uppercase tracking-widest">Phone number</div>
          <p className="mt-1 text-[#F0EAE6]">{phoneNumber?.phoneNumber ?? 'N/A'}</p>

          <div className="mt-4 text-xs text-[#F0EAE6]/50 uppercase tracking-widest">Email address</div>
          <p className="mt-1 text-[#F0EAE6]">{emailAddress?.emailAddress ?? 'N/A'}</p>
        </div>
      </div>
    </>
  );
}
