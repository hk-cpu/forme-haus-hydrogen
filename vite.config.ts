import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({isSsrBuild}) => ({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  assetsInclude: ['**/*.png'],
  ssr: {
    optimizeDeps: {
      include: ['typographic-base', 'fast-deep-equal', 'react-use'],
    },
    external: ['@remix-run/node'],
  },
  optimizeDeps: {
    include: [
      'clsx',
      '@headlessui/react',
      'typographic-base',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    sourcemap: false, // Disable sourcemaps to fix framer-motion warnings
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks(id) {
              // Isolate framer-motion into its own cacheable chunk
              if (id.includes('framer-motion')) return 'framer-motion';
              // Isolate Three.js (already lazy-loaded, but ensure separate cache)
              if (id.includes('three/')) return 'three';
              // Isolate react-three into its own chunk
              if (id.includes('@react-three')) return 'react-three';
            },
          },
        },
  },
}));
