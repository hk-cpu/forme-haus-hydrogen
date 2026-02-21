// Alias route for /products/:productHandle - re-exports from ($locale).products.$productHandle.tsx
import Product, {
  loader,
  meta,
  headers,
} from './($locale).products.$productHandle';
export {loader, meta, headers};
export default Product;
