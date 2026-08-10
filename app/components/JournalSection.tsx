import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface JournalCard {
  image: string;
  alt: string;
  url: string;
  width: number;
  height: number;
  /** English defaults, used when Admin has no value and no translation exists. */
  title: string;
  excerpt: string;
  /** Translation-file fallback for the three original cards. */
  titleKey?: string;
  excerptKey?: string;
  /** Copy managed in Shopify Admin — wins over `titleKey`/`excerptKey`. */
  titleEn?: string;
  titleAr?: string;
  excerptEn?: string;
  excerptAr?: string;
}

const JOURNAL_CARDS: JournalCard[] = [
  {
    image: '/brand/journal-wardrobe-opt.webp',
    alt: 'The Modern Wardrobe Edit',
    url: '/journal/the-modern-wardrobe-edit',
    title: 'The Modern Wardrobe Edit',
    excerpt: 'A wardrobe shaped by clarity and refined instinct.',
    titleKey: 'journal.modernWardrobe',
    excerptKey: 'journal.modernWardrobe.subtitle',
    width: 640,
    height: 1146,
  },
  {
    image: '/brand/journal-elegance-opt.webp',
    alt: 'Everyday Elegance',
    url: '/journal/everyday-elegance',
    title: 'Everyday Elegance',
    excerpt: 'Elegance is lived in the in-between moments.',
    titleKey: 'journal.everydayElegance',
    excerptKey: 'journal.everydayElegance.subtitle',
    width: 640,
    height: 954,
  },
  {
    image: '/brand/journal-selection-opt.webp',
    alt: 'Behind the Selection',
    url: '/journal/behind-the-selection',
    title: 'Behind the Selection',
    excerpt: 'Every piece begins with careful consideration.',
    titleKey: 'journal.behindCraft',
    excerptKey: 'journal.behindCraft.subtitle',
    width: 640,
    height: 640,
  },
];

/**
 * Resolves a piece of card copy for the active language.
 *
 * Order: the card's own Admin value for this language, then the translation
 * key, then the English default. An empty Admin field is skipped rather than
 * rendered, so clearing a value degrades to the translation instead of
 * blanking the card.
 */
function resolveCopy(
  adminValue: string | undefined,
  key: string | undefined,
  fallback: string,
  t: (k: string, d?: string) => string,
): string {
  if (adminValue) return adminValue;
  if (key) return t(key, fallback);
  return fallback;
}

export default function JournalSection({
  cards = JOURNAL_CARDS,
}: {
  cards?: JournalCard[];
}) {
  const {isRTL, t, lang} = useTranslation();

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
          {cards.map((card) => {
            const title = resolveCopy(
              lang === 'AR' ? card.titleAr : card.titleEn,
              card.titleKey,
              card.title,
              t,
            );
            const excerpt = resolveCopy(
              lang === 'AR' ? card.excerptAr : card.excerptEn,
              card.excerptKey,
              card.excerpt,
              t,
            );

            return (
              <Link key={card.url} to={card.url} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#E8E4E0]">
                  <img
                    src={card.image}
                    alt={card.alt || title}
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
                    {title}
                  </h3>
                  {excerpt && (
                    <span className="font-serif text-xs italic text-[#8B7D72]">
                      —&nbsp;{excerpt}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
