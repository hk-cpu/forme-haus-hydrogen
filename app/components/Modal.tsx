import {IconClose} from '~/components/Icon';
import {Link} from '~/components/Link';

export function Modal({
  children,
  cancelLink,
}: {
  children: React.ReactNode;
  cancelLink: string;
}) {
  return (
    <div
      className="relative z-50"
      aria-label="Dialog"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
    >
      <div className="fixed inset-0 transition-opacity bg-opacity-75 bg-primary/40"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            className="relative flex-1 px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded-xl shadow-xl bg-[#1E1814] border border-bronze/10 sm:my-12 sm:flex-none sm:w-full sm:max-w-sm sm:p-6"
            role="dialog"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
              <Link
                to={cancelLink}
                className="p-4 -m-4 transition text-taupe hover:text-warm"
              >
                <IconClose aria-label="Close panel" />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
