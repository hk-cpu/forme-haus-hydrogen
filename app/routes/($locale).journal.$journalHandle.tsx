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
      title: 'مختارات الخزانة العصرية',
      body: [
        'خزانة تصنعها وضوح الرؤية والذوق المصفّى.',
        'قصّات منحوتة، بنية متوازنة، وأقمشة اختيرت لحركتها بقدر ما اختيرت لمظهرها. قطع انتقيت لحضورها من دون إفراط، رصينة، واثقة، وخالدة.',
        'أسلوب في اللباس يتحدث بهدوء، لكن بيقين.',
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
      image: '/brand/journal-elegance-v2.jpg',
    },
    AR: {
      title: 'أناقة كل يوم',
      body: [
        'الأناقة تُعاش في التفاصيل وبين اللحظات.',
        'تتجلّى في حركة ناعمة، وإيماءات متّزنة، وثقة هادئة ترافقك طوال اليوم.',
        'أسلوب في اللباس يعكس توازنًا داخليًا.',
        'بلا تكلّف. بثبات. بأناقة.',
      ],
      image: '/brand/journal-elegance-v2.jpg',
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
      image: '/brand/journal-selection-v2.jpg',
    },
    AR: {
      title: 'خلف الاختيار',
      body: [
        'كل قطعة تبدأ بعناية وتأمل.',
        'التناسب والصنعة والحِرفيّة لا تُقيَّم بمظهرها فحسب، بل بمدى صمودها عبر الزمن.',
        'اختيار صاغه وضوح الرؤية والنيّة الدائمة.',
      ],
      image: '/brand/journal-selection-v2.jpg',
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
        title: `${staticArticle!.title} | ${language === 'AR' ? 'مجلة فورمي هاوس' : 'Formé Haus Journal'}`,
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
      <div className="min-h-screen bg-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <header className="text-center mb-12">
            <span className={`text-[10px] ${isRTL ? '' : 'uppercase tracking-[0.3em]'} text-[#a87441] block mb-4`}>
              {t('nav.journal', 'Journal')}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl italic text-[#4A3C31] mb-4">
              {title}
            </h1>
            <span className="text-[12px] text-[#8B8076]">
              {formattedDate} {author?.name && `· ${author.name}`}
            </span>
          </header>
          {image && (
            <Image
              data={image}
              className="w-full rounded-xl mb-12"
              sizes="(min-width: 768px) 720px, 100vw"
              loading="eager"
            />
          )}
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#4A3C31] prose-p:text-[#5C5046] prose-p:leading-relaxed prose-a:text-[#a87441]"
          />
        </div>
      </div>
    );
  }

  // Render static editorial article
  if (!staticArticle) return null;

  return (
    <div className="relative min-h-screen bg-[#F9F5F0] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Full-screen book cover hero */}
      {staticArticle.image && (
        <motion.div
          className="relative w-full h-screen min-h-[600px]"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1.2, ease: 'easeOut'}}
        >
          <img
            src={staticArticle.image}
            alt={staticArticle.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

          {/* Title overlaid at bottom of cover */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-16 md:pb-24 px-6"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          >
            <span className={`text-[10px] ${isRTL ? '' : 'uppercase tracking-[0.3em]'} text-[#D4AF87] block mb-4 font-semibold`}>
              {t('nav.journal', 'Journal')}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl italic text-white mb-6 drop-shadow-lg text-center max-w-2xl">
              {staticArticle.title}
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Body content */}
        <motion.article
          className="space-y-6 md:space-y-8"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.8, delay: 0.3}}
        >
          {staticArticle.body.map((paragraph, i) => (
            <p
              key={i}
              className="font-serif text-lg md:text-xl text-[#5C5046] leading-relaxed tracking-wide"
              style={{textIndent: i === 0 ? 0 : undefined}}
            >
              {paragraph}
            </p>
          ))}
        </motion.article>

        {/* Extra editorial images — only shown when populated */}
        {staticArticle.extraImages && staticArticle.extraImages.length > 0 && (
          <div className="mt-16 space-y-8">
            {staticArticle.extraImages[0] && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={staticArticle.extraImages[0]}
                  alt={staticArticle.title}
                  className="w-full max-h-[50vh] object-cover object-center"
                />
              </div>
            )}
            {staticArticle.extraImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {staticArticle.extraImages.slice(1, 3).map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-xl">
                    <img
                      src={src}
                      alt={`${staticArticle.title} ${i + 2}`}
                      className="w-full aspect-square object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Decorative end mark */}
        <div className="mt-16 flex justify-center">
          <div className="w-px h-10 bg-gradient-to-b from-[#a87441]/30 to-transparent" />
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
