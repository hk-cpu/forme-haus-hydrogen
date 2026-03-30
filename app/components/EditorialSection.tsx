import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface EditorialItem {
  image: string;
  alt: string;
  url: string;
  title: string;
  subtitle: string;
  width: number;
  height: number;
}

const ITEMS: EditorialItem[] = [
  {
    image: '/brand/edit-modern-essentials-opt.webp',
    alt: 'Modern Essentials',
    url: '/collections/sunglasses',
    title: 'Modern Essentials',
    subtitle: 'Timeless pieces for everyday elegance',
    width: 720,
    height: 988,
  },
  {
    image: '/brand/edit-carry-opt.webp',
    alt: 'Carry It Your Way',
    url: '/collections/phone-cases',
    title: 'Carry It Your Way',
    subtitle: 'Hands-free style',
    width: 720,
    height: 720,
  },
  {
    image: '/brand/edit-sun-ready-opt.webp',
    alt: 'Sun Ready',
    url: '/collections/sunglasses',
    title: 'Sun Ready',
    subtitle: 'For golden hours',
    width: 720,
    height: 720,
  },
  {
    image: '/brand/edit-new-arrivals-opt.webp',
    alt: 'New Arrivals',
    url: '/collections/new-in',
    title: 'New Arrivals',
    subtitle: 'Latest from the Haus',
    width: 720,
    height: 965,
  },
];

export default function EditorialSection() {
  const {isRTL} = useTranslation();

  return (
    <section
      aria-label="Editorial"
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="mx-auto max-w-[var(--container-max)]"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-2xl italic text-[#4A3C31] md:text-3xl">
            The Edit
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {ITEMS.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="group relative block overflow-hidden rounded-[14px] bg-[#E8E4E0]"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                width={item.width}
                height={item.height}
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <h3 className="font-serif text-lg italic tracking-wide text-white md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs tracking-wide text-white/75">
                  {item.subtitle}
                </p>
                <div className="mt-2 h-[1px] w-6 bg-[#D4AF87] transition-all duration-300 group-hover:w-10" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
