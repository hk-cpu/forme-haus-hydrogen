import {motion} from 'framer-motion';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface JournalCard {
  image: string;
  alt: string;
  url: string;
  title: string;
  excerpt: string;
}

const JOURNAL_CARDS: JournalCard[] = [
  {
    image: '/brand/journal-wardrobe.webp',
    alt: 'The Modern Wardrobe Edit',
    url: '/journal/the-modern-wardrobe-edit',
    title: 'The Modern Wardrobe Edit',
    excerpt: 'A wardrobe shaped by clarity and refined instinct.',
  },
  {
    image: '/brand/journal-elegance.webp',
    alt: 'Everyday Elegance',
    url: '/journal/everyday-elegance',
    title: 'Everyday Elegance',
    excerpt: 'Elegance is lived in the in-between moments.',
  },
  {
    image: '/brand/journal-selection.webp',
    alt: 'Behind the Selection',
    url: '/journal/behind-the-selection',
    title: 'Behind the Selection',
    excerpt: 'Every piece begins with careful consideration.',
  },
];

function Card({card, index}: {card: JournalCard; index: number}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
    >
      <Link to={card.url} className="block">
        <div className="relative overflow-hidden rounded-[14px] bg-[#E8E4E0] aspect-[4/5]">
          <img
            src={card.image}
            alt={card.alt}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            width="600"
            height="750"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 rounded-[14px] border border-white/0 group-hover:border-white/15 transition-colors duration-500 pointer-events-none" />
        </div>

        <div className="mt-3 px-1">
          <h3 className="font-serif text-base md:text-lg italic text-[#4A3C31] group-hover:text-[#a87441] transition-colors duration-300">
            {card.title}
          </h3>
          <p className="text-xs text-[#736659] mt-1 leading-relaxed">
            {card.excerpt}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function JournalSection() {
  const {isRTL} = useTranslation();

  return (
    <section
      aria-label="The Journal"
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[1200px] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="flex justify-between items-end mb-6"
        >
          <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
            The Journal
          </h2>
          <Link
            to="/journal"
            className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] hover:text-[#4A3C31] transition-colors duration-300 py-2 inline-flex items-center min-h-[44px]"
          >
            Read the Journal
          </Link>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {JOURNAL_CARDS.map((card, i) => (
            <Card key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
