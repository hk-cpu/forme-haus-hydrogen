import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import 'dotenv/config';

const query = `
{
  collection(handle: "carry-it-your-way") {
    title
    products(first: 20) {
      nodes {
        id
        title
        handle
        productType
        tags
      }
    }
  }
}
`;

async function run() {
  const domain = process.env.PUBLIC_STORE_DOMAIN;
  const endpoint = 'https://' + domain + '/api/2024-10/graphql.json';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token':
        process.env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    body: JSON.stringify({query}),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run().catch(console.error);
