import { Spinner } from '~/components/Spinner';

export function CartLoading() {
  return (
    <div className="flex w-full h-screen-no-nav justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
}
