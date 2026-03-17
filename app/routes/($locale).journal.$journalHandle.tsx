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

import styles from '../styles/custom-font.css?url';

const BLOG_HANDLE = 'journal';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}];
};

// Static journal articles — rendered when Shopify blog entries don't exist
const STATIC_ARTICLES: Record<
  string,
  {
    title: string;
    body: string[];
    image?: string;
  }
> = {
  'the-modern-wardrobe-edit': {
    title: 'The Modern Wardrobe Edit',
    body: [
      'A wardrobe shaped by clarity and refined instinct.',
      'Sculpted silhouettes, balanced structure, and textures chosen for how they move as much as how they appear. Pieces selected for presence without excess, composed, assured, and enduring.',
      'A way of dressing that speaks quietly, yet with certainty.',
    ],
    image: '/brand/journal-wardrobe.webp',
  },
  'everyday-elegance': {
    title: 'Everyday Elegance',
    body: [
      'Elegance is lived in the in-between moments.',
      'It reveals itself in soft movement, measured gestures, and the calm confidence carried through the day.',
      'A way of dressing that mirrors inner balance.',
      'Effortless. Grounded. Graceful.',
    ],
    image: '/brand/journal-elegance.webp',
  },
  'behind-the-selection': {
    title: 'Behind the Selection',
    body: [
      'Every piece begins with careful consideration.',
      'Proportion, fabrication, and craftsmanship are considered not only for how they appear, but for how they endure.',
      'A selection shaped by clarity and lasting intention.',
    ],
    image: '/brand/journal-selection.png',
  },
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  invariant(params.journalHandle, 'Missing journal handle');

  // Check if this is a static article first
  const staticArticle = STATIC_ARTICLES[params.journalHandle];

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
        title: `${staticArticle!.title} | Formé Haus Journal`,
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

  // Render Shopify article if it exists
  if (article) {
    const {title, image, contentHtml, author} = article;
    return (
      <div className="min-h-screen bg-[#F9F5F0]">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <header className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a87441] block mb-4">
              Journal
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
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.header
          className="text-center mb-12 md:mb-16"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#a87441] block mb-4">
            Journal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl italic text-[#4A3C31] mb-4">
            {staticArticle.title}
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent mx-auto mt-6" />
        </motion.header>

        {/* Hero image */}
        {staticArticle.image && (
          <motion.div
            className="mb-12 md:mb-16 overflow-hidden rounded-xl"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.15}}
          >
            <img
              src={staticArticle.image}
              alt={staticArticle.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </motion.div>
        )}

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

        {/* Image placeholder slots for future editorial images */}
        <div className="mt-16 space-y-8">
          <div className="aspect-[16/9] bg-[#E8E4E0] rounded-xl flex items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B8076]/40">
              Editorial Image — Coming Soon
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-[#E8E4E0] rounded-xl flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076]/40">
                Image Slot
              </span>
            </div>
            <div className="aspect-square bg-[#E8E4E0] rounded-xl flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076]/40">
                Image Slot
              </span>
            </div>
          </div>
        </div>

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
