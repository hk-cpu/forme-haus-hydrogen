import { json } from '@remix-run/server-runtime';
import {
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { flattenConnection, getSeoMeta, Image } from '@shopify/hydrogen';

import { PageHeader, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Grid } from '~/components/Grid';
import { getImageLoadingPriority, PAGINATION_SIZE } from '~/lib/const';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import type { ArticleFragment } from 'storefrontapi.generated';

const BLOG_HANDLE = 'Journal';

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: { storefront },
}: LoaderFunctionArgs) => {
  const { language, country } = storefront.i18n;
  const { blog } = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  const articles = (flattenConnection(blog.articles) as ArticleFragment[]).map((article) => {
    const { publishedAt } = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt)),
    };
  });

  const seo = seoPayload.blog({ blog, url: request.url });

  return json({ articles, seo });
};

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Journals() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <div className="pt-24 min-h-screen container mx-auto px-6 md:px-12">
      <PageHeader heading={BLOG_HANDLE} className="mb-16 text-center" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {articles.map((article, i) => (
          <ArticleCard
            blogHandle={BLOG_HANDLE.toLowerCase()}
            article={article}
            key={article.id}
            loading={getImageLoadingPriority(i, 2)}
            isFeatured={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({
  blogHandle,
  article,
  loading,
  isFeatured,
}: {
  blogHandle: string;
  article: ArticleFragment;
  loading?: HTMLImageElement['loading'];
  isFeatured?: boolean;
}) {
  return (
    <li className={`list-none group ${isFeatured ? 'md:col-span-2 mb-12' : ''}`} key={article.id}>
      <Link to={`/${blogHandle}/${article.handle}`} className="block">
        {article.image && (
          <div className={`overflow-hidden mb-6 ${isFeatured ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
            <Image
              alt={article.image.altText || article.title}
              className="object-cover w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
              data={article.image}
              aspectRatio={isFeatured ? '2/1' : '3/2'}
              loading={loading}
              sizes={isFeatured ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
            />
          </div>
        )}
        <div className={`space-y-3 ${isFeatured ? 'text-center max-w-2xl mx-auto' : ''}`}>
          <span className="block text-[#F0EAE6]/60 text-xs uppercase tracking-[0.2em]">{article.publishedAt}</span>
          <h2 className={`font-serif text-[#F0EAE6] ${isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl'} group-hover:text-white transition-colors`}>
            {article.title}
          </h2>
          <div className="pt-2">
            <span className="text-[#F0EAE6] border-b border-[#F0EAE6]/30 pb-1 text-xs uppercase tracking-widest group-hover:border-[#F0EAE6] transition-all">Read Story</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode
  $blogHandle: String!
  $pageBy: Int!
  $cursor: String
) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    title
    seo {
      title
      description
    }
    articles(first: $pageBy, after: $cursor) {
      edges {
        node {
          ...Article
        }
      }
    }
  }
}

fragment Article on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
}
`;
