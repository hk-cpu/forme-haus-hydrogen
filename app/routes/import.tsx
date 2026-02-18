import {redirect} from '@shopify/remix-oxygen';

// Simple redirect to the Shopify Admin product import page
export async function loader() {
  return redirect('https://f0c5au-jn.myshopify.com/admin/products/import');
}
