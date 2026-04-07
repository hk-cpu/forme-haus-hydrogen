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
    extraImages?: string[];
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
    image: '/brand/journal-selection.webp',
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
    <div className="relative min-h-screen bg-[#F9F5F0] overflow-hidden">
      {/* Magazine Background Image */}
      {staticArticle.image && (
        <motion.div 
          className="fixed inset-0 z-0 pointer-events-none"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1.5, ease: 'easeOut'}}
        >
          <img
            src={staticArticle.image}
            alt=""
            className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
          />
          {/* Gradient overlay to ensure text readability toward the bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F5F0]/10 via-[#F9F5F0]/50 to-[#F9F5F0]" />
        </motion.div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <motion.header
          className="text-center mb-16 md:mb-24"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#a87441] block mb-4 font-semibold">
            Journal
          </span>
          <h1 className="font-serif text-4xl md:text-6xl italic text-[#4A3C31] mb-6 drop-shadow-sm">
            {staticArticle.title}
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#a87441]/60 to-transparent mx-auto mt-8" />
        </motion.header>

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
