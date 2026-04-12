import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface JournalCard {
  image: string;
  alt: string;
  url: string;
  title: string;
  excerpt: string;
  width: number;
  height: number;
}

const JOURNAL_CARDS: JournalCard[] = [
  {
    image: '/brand/journal-wardrobe-opt.webp',
    alt: 'The Modern Wardrobe Edit',
    url: '/journal/the-modern-wardrobe-edit',
    title: 'The Modern Wardrobe Edit',
    excerpt: 'A wardrobe shaped by clarity and refined instinct.',
    width: 640,
    height: 1146,
  },
  {
    image: '/brand/journal-selection-opt.webp',
    alt: 'Everyday Elegance',
    url: '/journal/everyday-elegance',
    title: 'Everyday Elegance',
    excerpt: 'Elegance is lived in the in-between moments.',
    width: 640,
    height: 954,
  },
  {
    image: '/brand/journal-elegance-opt.webp',
    alt: 'Behind the Selection',
    url: '/journal/behind-the-selection',
    title: 'Behind the Selection',
    excerpt: 'Every piece begins with careful consideration.',
    width: 640,
    height: 640,
  },
];

export default function JournalSection() {
  const {isRTL, t} = useTranslation();

  return (
    <section
      aria-label={t('home.journal', 'The Journal')}
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="mx-auto max-w-[1200px]"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-2xl italic text-brand-text md:text-3xl">
            {t('home.journal', 'The Journal')}
          </h2>
          <Link
            to="/journal"
            className={`inline-flex min-h-[44px] items-center py-2 text-[10px] ${
              isRTL ? '' : 'uppercase tracking-[0.2em]'
            } text-[#6B6058] transition-colors duration-300 hover:text-brand-text`}
          >
            {t('journal.read', 'Read the Journal')}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {JOURNAL_CARDS.map((card) => (
            <Link key={card.title} to={card.url} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#E8E4E0]">
                <img
                  src={card.image}
                  alt={t(
                    card.title === 'The Modern Wardrobe Edit'
                      ? 'journal.modernWardrobe'
                      : card.title === 'Everyday Elegance'
                      ? 'journal.everydayElegance'
                      : 'journal.behindCraft',
                    card.alt,
                  )}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  width={card.width}
                  height={card.height}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-3 px-1 flex items-baseline gap-1.5 flex-wrap">
                <h3 className="font-serif text-sm md:text-base italic text-brand-text transition-colors duration-300 group-hover:text-bronze">
                  {t(
                    card.title === 'The Modern Wardrobe Edit'
                      ? 'journal.modernWardrobe'
                      : card.title === 'Everyday Elegance'
                      ? 'journal.everydayElegance'
                      : 'journal.behindCraft',
                    card.title,
                  )}
                </h3>
                <span className="font-serif text-xs italic text-[#8B7D72]">
                  —&nbsp;{t(
                    card.title === 'The Modern Wardrobe Edit'
                      ? 'journal.modernWardrobe.subtitle'
                      : card.title === 'Everyday Elegance'
                      ? 'journal.everydayElegance.subtitle'
                      : 'journal.behindCraft.subtitle',
                    card.excerpt,
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
