import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuxuryStorefront, { StoreProvider, Header, NavigationMenu, SearchOverlay, LoginOverlay, FilterPanel, CartDrawer, PromoBanner, Footer, tokens } from '~/components/LuxuryStorefront';
import ProductDetailPage from '~/components/ProductDetailPage';

/**
 * LUXURY STOREFRONT DEMO
 *
 * This route showcases the complete luxury e-commerce frontend with:
 * - Homepage view with hero and featured collections
 * - Category listing page with filters
 * - Product detail page
 * - All overlay components (menu, search, login, cart, filters)
 *
 * Navigate between views using the tab bar at the top.
 */

type DemoView = 'home' | 'category' | 'product';

export default function LuxuryDemo() {
  const [currentView, setCurrentView] = useState<DemoView>('home');

  const views = [
    { id: 'home' as const, label: 'Homepage' },
    { id: 'category' as const, label: 'Category Page' },
    { id: 'product' as const, label: 'Product Detail' },
  ];

  return (
    <StoreProvider>
      <div className="demo-container">
        {/* Demo Navigation */}
        <nav className="demo-nav">
          <div className="demo-nav-inner">
            <span className="demo-title">Luxury Storefront Demo</span>
            <div className="demo-tabs">
              {views.map((view) => (
                <button
                  key={view.id}
                  className={`demo-tab ${currentView === view.id ? 'active' : ''}`}
                  onClick={() => setCurrentView(view.id)}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="demo-content">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LuxuryStorefront page="home" />
              </motion.div>
            )}
            {currentView === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LuxuryStorefront page="category" />
              </motion.div>
            )}
            {currentView === 'product' && (
              <motion.div
                key="product"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pdp-wrapper">
                  <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap"
                    rel="stylesheet"
                  />
                  <PromoBanner />
                  <Header />
                  <NavigationMenu />
                  <SearchOverlay />
                  <LoginOverlay />
                  <FilterPanel />
                  <CartDrawer />
                  <ProductDetailPage />
                  <Footer />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <style>{`
          .demo-container {
            min-height: 100vh;
            background: ${tokens.colors.ivory};
          }
          .demo-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: linear-gradient(135deg, #1a1917 0%, #2d2a26 100%);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          .demo-nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
          .demo-title {
            font-family: ${tokens.fonts.serif};
            font-size: 16px;
            font-weight: 500;
            color: ${tokens.colors.ivory};
            letter-spacing: 0.05em;
          }
          .demo-tabs {
            display: flex;
            gap: 4px;
            background: rgba(255, 255, 255, 0.08);
            padding: 4px;
            border-radius: 8px;
          }
          .demo-tab {
            padding: 10px 20px;
            background: transparent;
            border: none;
            border-radius: 6px;
            font-family: ${tokens.fonts.sans};
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.04em;
            color: rgba(253, 251, 247, 0.6);
            cursor: pointer;
            transition: all 0.25s ease;
          }
          .demo-tab:hover {
            color: ${tokens.colors.ivory};
            background: rgba(255, 255, 255, 0.05);
          }
          .demo-tab.active {
            background: ${tokens.colors.ivory};
            color: ${tokens.colors.black};
          }
          .demo-content {
            padding-top: 56px;
          }
          .pdp-wrapper {
            background: ${tokens.colors.ivory};
            font-family: ${tokens.fonts.sans};
          }
          .pdp-wrapper * {
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            .demo-nav-inner {
              flex-direction: column;
              gap: 12px;
              padding: 12px 16px;
            }
            .demo-tabs {
              width: 100%;
              justify-content: center;
            }
            .demo-tab {
              flex: 1;
              padding: 8px 12px;
              font-size: 11px;
              text-align: center;
            }
            .demo-content {
              padding-top: 92px;
            }
          }
        `}</style>
      </div>
    </StoreProvider>
  );
}
