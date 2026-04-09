import {Link} from '~/components/Link';

export function AccountDetails({customer}: {customer: any}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-serif text-warm text-2xl mb-4">
          Account Details
        </h3>
        <div className="lg:p-8 p-6 bg-background/30 backdrop-blur-sm border border-warm/10 rounded-sm">
          <div className="flex items-baseline border-b border-warm/10 pb-4 mb-4">
            <h3 className="font-medium text-warm flex-1 text-sm uppercase tracking-widest">
              Profile
            </h3>
            <Link
              prefetch="intent"
              className="text-[#C4A484] hover:text-warm text-xs uppercase tracking-widest transition-colors"
              to="/account/edit"
            >
              Edit
            </Link>
          </div>
          <div className="mt-4 text-xs text-warm/50 uppercase tracking-widest">
            Name
          </div>
          <p className="mt-1 text-warm">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : 'Add name'}{' '}
          </p>

          <div className="mt-4 text-xs text-warm/50 uppercase tracking-widest">
            Phone number
          </div>
          <p className="mt-1 text-warm">{phone || 'N/A'}</p>

          <div className="mt-4 text-xs text-warm/50 uppercase tracking-widest">
            Email address
          </div>
          <p className="mt-1 text-warm">{email || 'N/A'}</p>
        </div>
      </div>
    </>
  );
}
