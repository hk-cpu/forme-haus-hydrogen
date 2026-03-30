/**
 * ARABIC TRANSLATION FIXES
 * Implementation-ready corrections for Formé Haus
 * 
 * Copy these values into app/lib/translations.ts
 */

export const TRANSLATION_FIXES = {
  // ============================================
  // 🔴 CRITICAL FIXES - Implement Immediately
  // ============================================

  // Navigation - Fix masculine forms to feminine
  'nav.shop': 'تسوّقي',                    // Was: 'تسوّق' (masculine)
  'nav.search': 'ابحثي',                   // Was: 'بحث' (noun, not imperative)
  
  // Header - Consistency with navigation
  'header.search': 'ابحثي',                // Was: 'بحث'
  
  // Home - Fix masculine CTA
  'home.shopCollection': 'تسوّقي المجموعة', // Was: 'تسوّق المجموعة'
  
  // Cart - Fix grammar and add elegance
  'cart.emptyStats': 'حقيبتكِ في انتظار اختياراتكِ المميزة', 
  // Was: 'يبدو أنك لم تُضيفي أي شيء بعد، دعينا نبدأ!'
  
  // Cart - Use Eastern Arabic numerals for Saudi market
  'cart.saudiAddr': 'للعملاء في المملكة: يُرجى استخدام العنوان الوطني المكوّن من ٨ أرقام لضمان التوصيل.',
  // Was: using "8" Western numeral
  
  // Product - Consider gender-neutral for broader appeal
  'product.addToCart': 'إضافة إلى الحقيبة',  // Verbal noun = gender neutral
  // Alternative: Keep 'أضيفي إلى الحقيبة' for strict feminine targeting

  // ============================================
  // 🟡 HIGH PRIORITY UX IMPROVEMENTS
  // ============================================

  // Hero - More conversion-focused
  'hero.cta': 'تسوقي الآن',                // Was: 'استكشفي المجموعة'
  // Alternative: 'اكتشفي الجديد' (if emphasizing new arrivals)
  
  // Notify - More natural Arabic
  'notify.submit': 'أخبريني عند التوفر',   // Was: 'أعلميني'
  
  // Search - Warmer empty state
  'search.noResults': 'لم نجد ما تبحثين عنه 💭 جربي كلمات مختلفة أو تصفحي مجموعاتنا',
  // Was: 'لم يتم العثور على نتائج'
  
  // Cart empty - Add sparkle and CTA
  'cart.empty': 'حقيبتك فارغة ✨',         // Add sparkle emoji
  
  // ============================================
  // 🟡 BRAND VOICE ELEVATION
  // ============================================

  // Editorial - Less journalistic
  'home.editorial': 'مختاراتنا',           // Was: 'اختيارات المحرر'
  // Alternative: 'تشكيلتنا المختارة'
  
  // Stats - More elegant
  'stats.title': 'رحلتنا',                 // Was: 'أرقامنا'
  // Alternative: 'إرثنا في أرقام' (Our Legacy in Numbers)
  
  // FAQ - Warmer
  'faq.title': 'استفساراتكم',              // Was: 'الأسئلة الشائعة'
  
  // Mega Menu - Elevation
  'menu.bestSellers': 'الأكثر تفضيلاً',    // Was: 'الأكثر طلبًا'
  'menu.workwearEssentials': 'أناقة العمل', // Was: 'أساسيات العمل'
  'menu.minimalStaples': 'التصاميم المحايدة', // Was: 'القطع الأساسية'
  'menu.signaturePieces': 'تشكيلتنا المميزة', // Was: 'قطع مميزة'
  
  // New In - Consistency
  'menu.newArrivals': 'وصل حديثاً',        // Was: 'وصل جديد' (incomplete)
  'nav.newIn': 'جديدنا',                   // Was: 'وصل حديثاً' - more elegant
  
  // ============================================
  // ✅ COMPLIANCE FIXES
  // ============================================

  // Standardize numerals across all price displays
  'banner.shipping': 'شحن مجاني للطلبات فوق 300 ر.س',  // Western numerals
  'topBar.promo': 'شحن مجاني للطلبات فوق 299 ر.س',     // Already Western
  
  // Return policy - Consider extending to 14 days
  'cart.refundsNote': '(استرجاع خلال 14 يوماً).',  // Was: 7 days
  // Note: 7 days is legal minimum, 14 is market standard
  
  // Fix diacritic
  'menu.knitwear': 'قِطَع مُحاكة',         // Was: 'قطَع محاكة' (extra sukun)
  
  // ============================================
  // 🟢 NICE TO HAVE REFINEMENTS
  // ============================================
  
  // Newsletter - Warmer options
  'footer.newsletter': 'انضمي إلى عائلتنا',  // Warmer than 'انضمي لنشرتنا'
  // Alternative: 'اشتركي في نشرتنا الخاصة' (exclusive)
  
  // Placeholder - Shorter, cleaner
  'footer.emailPlaceholder': 'بريدك الإلكتروني',  // Was: 'أدخلي بريدك الإلكتروني'
  'search.placeholder': 'ابحثي عن قطعتكِ...',  // More evocative
  
  // Category CTA - Elevate
  'menu.cta.exploreClothing': 'اكتشفي أناقة العمل',  // Was: 'اكتشفي ملابس العمل'
};

/**
 * COMPONENTS WITH HARDCODED TEXT NEEDING TRANSLATION KEYS
 * These should be moved to translations.ts
 */

export const MISSING_TRANSLATION_KEYS = {
  // WhyChooseUs.tsx - Add these to translations.ts
  'whyChooseUs.title': 'Why Choose Us',
  'whyChooseUs.titleAr': 'لماذا تختارنا',
  
  // StatsSection.tsx - Already uses labelAr pattern, good
  
  // TrustBadges.tsx - Payment methods text
  'trust.paymentMethods': 'Secure payments via Tap: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, Tamara',
  'trust.paymentMethodsAr': 'طرق دفع متعددة عبر Tap: مدى، Visa، Mastercard، Apple Pay، STC Pay، تابي، تمارا',
  
  // MobileBottomNav.tsx
  'mobileNav.home': 'Home',
  'mobileNav.homeAr': 'الرئيسية',
  'mobileNav.search': 'Search',
  'mobileNav.searchAr': 'بحث',
  'mobileNav.shop': 'Shop',
  'mobileNav.shopAr': 'تسوقي',  // Feminine
  'mobileNav.saved': 'Saved',
  'mobileNav.savedAr': 'المفضلة',
  'mobileNav.cart': 'Cart',
  'mobileNav.cartAr': 'الحقيبة',
};

/**
 * REMOVALS / DEPRECATIONS
 */

export const REMOVE_OR_REPLACE = {
  // Remove Muwathooq badge - not an official Saudi certification
  // Replace with: Saudi Chamber membership or secure payment badge
  
  // Update Maroof link from https://maroof.sa to specific profile:
  // https://maroof.sa/XXXXX (your actual CR number)
};

/**
 * A/B TEST RECOMMENDATIONS
 * Test these variations to optimize conversion
 */

export const AB_TEST_VARIANTS = {
  // Hero CTA Test
  'hero.cta.variantA': 'تسوقي الآن',           // Direct shopping intent
  'hero.cta.variantB': 'اكتشفي الجديد',        // Curiosity/novelty
  'hero.cta.variantC': 'استكشفي المجموعة',     // Current (exploratory)
  
  // Add to Cart Test
  'product.addToCart.variantA': 'إضافة إلى الحقيبة',  // Neutral (current recommendation)
  'product.addToCart.variantB': 'أضيفي إلى الحقيبة',  // Feminine (original)
  'product.addToCart.variantC': 'أضفي إلى السلة',     // Alternative term
  
  // Cart Empty State Test
  'cart.emptyStats.variantA': 'حقيبتكِ في انتظار اختياراتكِ المميزة',  // Elegant
  'cart.emptyStats.variantB': 'ابدئي رحلتك مع فورميه هاوس',             // Journey-focused
  'cart.emptyStats.variantC': 'تسوّقي الأكثر مبيعاً',                    // Direct to bestsellers
};
