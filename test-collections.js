const shop = 'f0c5au-jn.myshopify.com';
const token = 'a59f1cae84e9bcfd5847d357de86c528';
const query = `
{
  collections(first: 10) {
    nodes {
      id
      title
      handle
      products(first: 1) {
        nodes {
          title
        }
      }
    }
  }
}
`;

async function test() {
    const url = `https://${shop}/api/2024-10/graphql.json`;
    console.log(`Fetching from ${url}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Collections:', JSON.stringify(data.data.collections.nodes, null, 2));
    } catch (error) {
        console.error('Error fetching:', error);
    }
}

test();
