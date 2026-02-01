// vite.config.ts
import { defineConfig } from "file:///C:/Users/futte/FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///C:/Users/futte/FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///C:/Users/futte/FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///C:/Users/futte/FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///C:/Users/futte/FORME-HAUS/FORME-HAUS-main/forme-haus-static/forme-haus-hydrogen/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true
      }
    }),
    tsconfigPaths()
  ],
  ssr: {
    optimizeDeps: {
      include: ["typographic-base", "fast-deep-equal", "react-use"]
    }
  },
  optimizeDeps: {
    include: [
      "clsx",
      "@headlessui/react",
      "typographic-base",
      "react-intersection-observer",
      "react-use/esm/useScroll",
      "react-use/esm/useDebounce",
      "react-use/esm/useWindowScroll"
    ]
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmdXR0ZVxcXFxGT1JNRS1IQVVTXFxcXEZPUk1FLUhBVVMtbWFpblxcXFxmb3JtZS1oYXVzLXN0YXRpY1xcXFxmb3JtZS1oYXVzLWh5ZHJvZ2VuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmdXR0ZVxcXFxGT1JNRS1IQVVTXFxcXEZPUk1FLUhBVVMtbWFpblxcXFxmb3JtZS1oYXVzLXN0YXRpY1xcXFxmb3JtZS1oYXVzLWh5ZHJvZ2VuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9mdXR0ZS9GT1JNRS1IQVVTL0ZPUk1FLUhBVVMtbWFpbi9mb3JtZS1oYXVzLXN0YXRpYy9mb3JtZS1oYXVzLWh5ZHJvZ2VuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IGh5ZHJvZ2VuIH0gZnJvbSAnQHNob3BpZnkvaHlkcm9nZW4vdml0ZSc7XHJcbmltcG9ydCB7IG94eWdlbiB9IGZyb20gJ0BzaG9waWZ5L21pbmktb3h5Z2VuL3ZpdGUnO1xyXG5pbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgaHlkcm9nZW4oKSxcclxuICAgIG94eWdlbigpLFxyXG4gICAgcmVtaXgoe1xyXG4gICAgICBwcmVzZXRzOiBbaHlkcm9nZW4ucHJlc2V0KCldLFxyXG4gICAgICBmdXR1cmU6IHtcclxuICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcclxuICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxyXG4gICAgICAgIHYzX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgdHNjb25maWdQYXRocygpLFxyXG4gIF0sXHJcbiAgc3NyOiB7XHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogWyd0eXBvZ3JhcGhpYy1iYXNlJywgJ2Zhc3QtZGVlcC1lcXVhbCcsICdyZWFjdC11c2UnXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcclxuICAgICAgJ2Nsc3gnLFxyXG4gICAgICAnQGhlYWRsZXNzdWkvcmVhY3QnLFxyXG4gICAgICAndHlwb2dyYXBoaWMtYmFzZScsXHJcbiAgICAgICdyZWFjdC1pbnRlcnNlY3Rpb24tb2JzZXJ2ZXInLFxyXG4gICAgICAncmVhY3QtdXNlL2VzbS91c2VTY3JvbGwnLFxyXG4gICAgICAncmVhY3QtdXNlL2VzbS91c2VEZWJvdW5jZScsXHJcbiAgICAgICdyZWFjdC11c2UvZXNtL3VzZVdpbmRvd1Njcm9sbCcsXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIEFsbG93IGEgc3RyaWN0IENvbnRlbnQtU2VjdXJpdHktUG9saWN5XHJcbiAgICAvLyB3aXRodG91dCBpbmxpbmluZyBhc3NldHMgYXMgYmFzZTY0OlxyXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNmEsU0FBUyxvQkFBb0I7QUFDMWMsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsY0FBYyxhQUFhO0FBQ3BDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxTQUFTLE9BQU8sQ0FBQztBQUFBLE1BQzNCLFFBQVE7QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLHNCQUFzQjtBQUFBLFFBQ3RCLHFCQUFxQjtBQUFBLFFBQ3JCLHVCQUF1QjtBQUFBLE1BQ3pCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxvQkFBb0IsbUJBQW1CLFdBQVc7QUFBQSxJQUM5RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFHTCxtQkFBbUI7QUFBQSxFQUNyQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
