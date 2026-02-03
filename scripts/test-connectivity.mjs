
import { createStorefrontClient } from '@shopify/hydrogen-react';
import fs from 'fs';
import path from 'path';

// Manually parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = {};

try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            envConfig[key] = value;
        }
    });
} catch (e) {
    console.error("Error reading .env file:", e);
    process.exit(1);
}

const client = createStorefrontClient({
    privateStorefrontToken: envConfig.PRIVATE_STOREFRONT_API_TOKEN,
    storeDomain: envConfig.PUBLIC_STORE_DOMAIN,
    storefrontApiVersion: envConfig.PUBLIC_STOREFRONT_API_VERSION || '2024-01',
    publicStorefrontToken: envConfig.PUBLIC_STOREFRONT_API_TOKEN,
});

const QUERY = `
  query {
    shop {
      name
      primaryDomain {
        url
      }
    }
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          totalInventory
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
    collections(first: 5) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

async function main() {
    console.log("--- Starting Connectivity Test ---");
    console.log(`Target Store: ${envConfig.PUBLIC_STORE_DOMAIN}`);

    try {
        const response = await fetch(client.getStorefrontApiUrl(), {
            method: 'POST',
            headers: client.getPublicTokenHeaders(),
            body: JSON.stringify({ query: QUERY }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Fetch failed: ${response.status} ${response.statusText} - ${text}`);
        }

        const json = await response.json();

        if (json.errors) {
            console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
            process.exit(1);
        }

        const data = json.data;
        console.log("SUCCESS: Connected to Shopify Storefront API");
        console.log(`Shop Name: ${data.shop.name}`);
        console.log(`Primary Domain: ${data.shop.primaryDomain.url}`);

        console.log("\n--- Product Check ---");
        const products = data.products.edges;
        if (products.length === 0) {
            console.warn("WARNING: No products found.");
        } else {
            console.log(`Found ${products.length} products:`);
            products.forEach(({ node }) => {
                const imageCount = node.images.edges.length;
                const status = imageCount > 0 ? "HAS_IMAGES" : "NO_IMAGES";
                console.log(`- ${node.title}: ${status} (${imageCount} images)`);
            });
        }

        console.log("\n--- Collection Check ---");
        const collections = data.collections.edges;
        if (collections.length === 0) {
            console.warn("WARNING: No collections found.");
        } else {
            console.log(`Found ${collections.length} collections.`);
        }

    } catch (error) {
        console.error("CONNECTION_FAILED:", error);
    }
}

main();
