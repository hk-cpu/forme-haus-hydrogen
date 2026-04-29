require('dotenv').config();

const query = `
  query PredictiveSearchFallback(
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

  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query,
      variables: {searchTerm: 'phone', limit: 5},
    }),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
