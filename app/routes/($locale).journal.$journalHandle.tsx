import {json} from '@remix-run/server-runtime';
import {
  type MetaArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import invariant from 'tiny-invariant';

import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

import styles from '../styles/custom-font.css?url';

const BLOG_HANDLE = 'journal';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}];
};

// Static journal articles — rendered when Shopify blog entries don't exist
const STATIC_ARTICLES: Record<
  string,
  Record<
    string,
    {
      title: string;
      body: string[];
      image?: string;
      extraImages?: string[];
    }
  >
> = {
  'the-modern-wardrobe-edit': {
    EN: {
      title: 'The Modern Wardrobe Edit',
      body: [
        'A wardrobe shaped by clarity and refined instinct.',
        'Sculpted silhouettes, balanced structure, and textures chosen for how they move as much as how they appear. Pieces selected for presence without excess, composed, assured, and enduring.',
        'A way of dressing that speaks quietly, yet with certainty.',
      ],
      image: '/brand/journal-wardrobe-v2.jpg',
    },
    AR: {
      title: 'تحرير الأسلوب الحديث',
      body: [
        'يُصاغ بوضوحٍ وغريزةٍ مصقولة',
        'تشكيلات منحوتة، وتوازن هادئ، وملمس يُختار لحركته بقدر حضوره',
        'قطع تُنتقى لحضورٍ دون إفراط… متزنة، واثقة، وممتدة في الزمن',
        'أسلوب ارتداء يتحدث بهدوء… بثقةٍ راسخة',
      ],
      image: '/brand/journal-wardrobe-v2.jpg',
    },
  },
  'everyday-elegance': {
    EN: {
      title: 'Everyday Elegance',
      body: [
        'Elegance is lived in the in-between moments.',
        'It reveals itself in soft movement, measured gestures, and the calm confidence carried through the day.',
        'A way of dressing that mirrors inner balance.',
        'Effortless. Grounded. Graceful.',
      ],
      image: '/brand/journal-selection-v2.jpg',
    },
    AR: {
      title: 'أناقة يومية',
      body: [
        'الأناقة تُعاش في المساحات بين اللحظات',
        'تتجلى في حركةٍ ناعمة، وإيماءاتٍ موزونة، وثقة هادئة ترافق اليوم',
        'أسلوب يعكس توازنًا داخليًا',
        'بلا تكلّف… راسخ… وانسيابي',
      ],
      image: '/brand/journal-selection-v2.jpg',
    },
  },
  'behind-the-selection': {
    EN: {
      title: 'Behind the Selection',
      body: [
        'Every piece begins with careful consideration.',
        'Proportion, fabrication, and craftsmanship are considered not only for how they appear, but for how they endure.',
        'A selection shaped by clarity and lasting intention.',
      ],
      image: '/brand/journal-elegance-v2.jpg',
    },
    AR: {
      title: 'ما وراء الاختيار',
      body: [
        'كل قطعة تبدأ بتأملٍ دقيق',
        'النِّسب، والخامات، والحِرفة تُدرس ليس فقط لمظهرها… بل لما تقدّمه من استمرارية',
        'اختيارات تُشكَّل بوضوح… ونيةٍ باقية',
      ],
      image: '/brand/journal-elegance-v2.jpg',
    },
  },
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  invariant(params.journalHandle, 'Missing journal handle');

  // Check if this is a static article first (pick language, fallback to EN)
  const staticVersions = STATIC_ARTICLES[params.journalHandle];
  const staticArticle = staticVersions
    ? staticVersions[language] || staticVersions.EN
    : undefined;

  // Try Shopify blog query
  let article: any = null;
  let formattedDate = '';

  try {
    const {blog} = await context.storefront.query(ARTICLE_QUERY, {
      variables: {
        blogHandle: BLOG_HANDLE,
        articleHandle: params.journalHandle,
        language,
      },
    });

    if (blog?.articleByHandle) {
      article = blog.articleByHandle;
      formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(article.publishedAt));
    }
  } catch {
    // Shopify article not found — fall through to static
  }

  // If no Shopify article and no static article, 404
  if (!article && !staticArticle) {
    throw new Response(null, {status: 404});
  }

  const seo = article
    ? seoPayload.article({article, url: request.url})
    : {
        title: `${staticArticle!.title} | ${
          language === 'AR' ? 'مجلة فورمي هاوس' : 'Formé Haus Journal'
        }`,
        description: staticArticle!.body[0],
      };

  return json({
    article,
    formattedDate,
    staticArticle: staticArticle || null,
    handle: params.journalHandle,
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function Article() {
  const {article, formattedDate, staticArticle} =
    useLoaderData<typeof loader>();
  const {t, isRTL} = useTranslation();

  // Render Shopify article if it exists
  if (article) {
    const {title, image, contentHtml, author} = article;
    return (
      <div
        className="relative min-h-screen overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Fixed full-page background image */}
        {image && (
          <div className="fixed inset-0 z-0">
            <Image
              data={image}
              className="w-full h-full object-cover object-center"
              sizes="100vw"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        {/* All content overlaid on the image */}
        <div className="relative z-10 flex flex-col">
          {/* Title section — 70vh so body is visible without deep scrolling */}
          <motion.div
            className="h-[70vh] flex flex-col items-center justify-center px-6"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          >
            <span
              className={`text-[10px] ${
                isRTL ? '' : 'uppercase tracking-[0.3em]'
              } text-[#D4AF87] block mb-4 font-semibold`}
            >
              {t('nav.journal', 'Journal')}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl italic text-white mb-4 drop-shadow-lg text-center max-w-2xl">
              {title}
            </h1>
            {(formattedDate || author?.name) && (
              <span className="text-[11px] text-white/60 mb-5 block uppercase tracking-wider">
                {formattedDate}{author?.name ? ` · ${author.name}` : ''}
              </span>
            )}
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6" />
            {/* Scroll indicator */}
            <motion.div
              animate={{y: [0, 6, 0]}}
              transition={{repeat: Infinity, duration: 2, ease: 'easeInOut'}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Body text — overlaid on the image below the fold */}
          <div className="max-w-2xl mx-auto px-6 pt-8 pb-20 w-full">
            <motion.article
              className="space-y-6"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.8, delay: 0.5}}
            >
              <div
                dangerouslySetInnerHTML={{__html: contentHtml}}
                className={`prose prose-lg max-w-none 
                  prose-headings:font-serif prose-headings:text-[#D4AF87] prose-headings:font-normal prose-headings:mt-10 prose-headings:mb-4
                  prose-p:text-white/90 prose-p:leading-loose prose-p:tracking-wide prose-p:text-[16px] md:prose-p:text-[18px] ${
                    isRTL ? 'prose-p:text-right' : 'prose-p:text-left'
                  }
                  prose-a:text-[#a87441] prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-white
                  prose-strong:text-white prose-strong:font-medium
                  prose-ul:text-white/90 prose-ol:text-white/90
                  drop-shadow-sm w-full`}
              />
            </motion.article>

            {/* Decorative end mark */}
            <div className="mt-16 flex justify-center">
              <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render static editorial article
  if (!staticArticle) return null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Fixed full-page background image */}
      {staticArticle.image && (
        <div className="fixed inset-0 z-0">
          <img
            src={staticArticle.image}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* All content overlaid on the image */}
      <div className="relative z-10 flex flex-col">
        {/* Title section — 70vh so body is visible without deep scrolling */}
        <motion.div
          className="h-[70vh] flex flex-col items-center justify-center px-6"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
        >
          <span
            className={`text-[10px] ${
              isRTL ? '' : 'uppercase tracking-[0.3em]'
            } text-[#D4AF87] block mb-4 font-semibold`}
          >
            {t('nav.journal', 'Journal')}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl italic text-white mb-4 drop-shadow-lg text-center max-w-2xl">
            {staticArticle.title}
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6" />
          {/* Scroll indicator */}
          <motion.div
            animate={{y: [0, 6, 0]}}
            transition={{repeat: Infinity, duration: 2, ease: 'easeInOut'}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Body text — overlaid on the image below the fold */}
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-20">
          <motion.article
            className="space-y-6"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.8, delay: 0.5}}
          >
            {staticArticle.body.map((paragraph, i) => (
              <p
                key={i}
                className={`${
                  i === 0
                    ? 'font-serif text-[20px] md:text-[22px] text-[#D4AF87] italic leading-relaxed drop-shadow-sm'
                    : 'font-serif text-[16px] md:text-[18px] text-white/85 leading-loose tracking-wide drop-shadow-sm'
                } ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </motion.article>

          {/* Decorative end mark */}
          <div className="mt-16 flex justify-center">
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
