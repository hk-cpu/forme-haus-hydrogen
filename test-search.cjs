const fs = require('fs');
require('dotenv').config();

const query = `
  query SearchFallback(
    $searchTerm: String!
    $limit: Int!
  ) {
    products(first: $limit, query: $searchTerm) {
      nodes {
        id
        title
      }
    }
  }
`;

async function test() {
  const token = process.env.PUBLIC_STOREFRONT_API_TOKEN;
  const domain = process.env.PUBLIC_STORE_DOMAIN;

  const searchInput = 'phone';
  // The user reported 8 results, but my test before returned 10.
  // Let's see what plain "phone" returns:
  const res1 = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query,
      variables: {searchTerm: searchInput, limit: 20},
    }),
  });

  const data1 = await res1.json();
  console.log(
    "Normal 'phone' search:",
    JSON.stringify(
      data1.data?.products?.nodes?.map((n) => n.title),
      null,
      2,
    ),
  );

  // Targeted
  const formattedSearchTerm = searchInput
    .split(' ')
    .filter((w) => w.trim().length > 0)
    .map(
      (word) => `(title:*${word}* OR product_type:*${word}* OR tag:*${word}*)`,
    )
    .join(' AND ');
  console.log('Formatted query:', formattedSearchTerm);

  const res2 = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query,
      variables: {searchTerm: formattedSearchTerm, limit: 20},
    }),
  });

  const data2 = await res2.json();
  console.log(
    'Targeted search:',
    JSON.stringify(
      data2.data?.products?.nodes?.map((n) => n.title),
      null,
      2,
    ),
  );
}

test();
