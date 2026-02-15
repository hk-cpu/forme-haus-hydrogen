/**
 * Static UI translations for FORMÉ HAUS
 * Shopify Storefront API handles product/collection/page content via @inContext(language)
 * This dictionary handles static UI strings that aren't managed by Shopify
 */

export type TranslationKey = keyof typeof translations.EN;

export const translations = {
  EN: {
    // Navigation
    'nav.shop': 'Shop',
    'nav.collections': 'The Collections',
    'nav.newIn': 'New In',
    'nav.designers': 'Designers',
    'nav.clothing': 'Clothing',
    'nav.shoes': 'Shoes',
    'nav.home': 'Home',
    'nav.sale': 'Sale',
    'nav.journal': 'Journal',
    'nav.about': 'About',

    // Header & Actions
    'header.search': '',
    'header.cart': 'Cart',
    'header.account': 'Account',
    'header.menu': 'Menu',

    // Hero
    'hero.cta': 'Explore the Collection',
    'hero.scroll': 'Scroll',

    // Status Banner
    'banner.shipping': 'Complimentary Global Shipping over 300 SAR',

    // Homepage Sections
    'home.categorySlider': 'The Collections',
    'home.editorial': 'The Edit',
    'home.brandIntro': 'Formé Haus is a curated destination inspired by modern elegance, refined detail, and thoughtful selection.',
    'home.curatedForYou': 'Where Elegance Begins',
    'home.journal': 'Journal',
    'home.editorial.label': 'Editorial',
    'home.newsletter.title': 'Launching soon in Saudi Arabia',
    'home.newsletter.subtitle': 'Join the list for exclusive updates',
    'home.shopCollection': 'Shop Collection',

    // Journal
    'journal.modernWardrobe': 'The Modern Wardrobe Edit',
    'journal.everydayElegance': 'Everyday Elegance',
    'journal.behindCraft': 'Behind the Selection',

    // Footer
    'footer.followUs': 'Follow Us',
    'footer.mobileApp': 'Mobile App',
    'footer.comingSoon': 'Coming Soon',
    'footer.crNo': 'CR No.',
    'footer.vatNo': 'VAT No.',
    'footer.vatCertificate': 'VAT Certificate',
    'footer.crCertificate': 'CR Certificate',
    'footer.description': 'Where Essence Meets Elegance',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.paymentMethods': 'Secure Payment Methods',

    // Newsletter / Notify
    'notify.email': 'Enter your email',
    'notify.submit': 'Notify Me',
    'notify.success': 'Thank you! We\'ll keep you updated.',

    // Product
    'product.addToCart': 'Add to Cart',
    'product.soldOut': 'Sold Out',
    'product.sale': 'Sale',
    'product.new': 'New',

    // Collection
    'collection.loading': 'Loading...',
    'collection.loadPrevious': 'Load previous',
    'collection.loadMore': 'Load more products',
    'collection.noProducts': 'No products found in this collection.',
    'collection.price': 'Price',

    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyStats': "Looks like you haven't added anything yet, let's get you started!",
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.saudiAddr': 'For Saudi Arabia: Please use your 8-digit National Address to ensure delivery.',
    'cart.terms': 'By checking out, you agree to our',
    'cart.termsLink': 'Terms',
    'cart.refunds': 'and acknowledge your',
    'cart.refundsLink': 'Consumer Rights',
    'cart.refundsNote': '(7-day returns).',
    'cart.discount': 'Discount code',
    'cart.applyDiscount': 'Apply Discount',
    'cart.shopBestSellers': 'Shop Best Sellers',
    'cart.vatIncluded': '(VAT included)',

    // Search
    'search.placeholder': 'Search products...',
    'search.noResults': 'No results found',

    // Product Card
    'product.viewDetails': 'View Details',
    'product.comingSoon': 'COMING SOON',
    'product.details': 'Product Details',
    'product.shipping': 'Shipping',
    'product.returns': 'Returns',
    'product.quickAdd': 'Quick Add',

    // General
    'general.viewAll': 'View All',
    'general.learnMore': 'Learn More',
    'general.backToHome': 'Back to Home',

    // Mega Menu - subsections (New In)
    'menu.newArrivals': 'New Arrivals',
    'menu.signaturePieces': 'Signature Pieces',
    'menu.weeklyHighlights': 'Weekly Highlights',
    'menu.bestSellers': 'Best Sellers',
    'menu.cta.shopNewIn': 'Shop New In',

    // Mega Menu - categories (Clothing)
    'menu.dresses': 'Dresses',
    'menu.tops': 'Tops & Blouses',
    'menu.shirts': 'Shirts',
    'menu.blazers': 'Blazers',
    'menu.trousers': 'Trousers',
    'menu.skirts': 'Skirts',
    'menu.knitwear': 'Knitwear',
    'menu.outerwear': 'Outerwear',

    // Occasions
    'menu.workwear': 'Workwear',
    'menu.evening': 'Evening',
    'menu.casual': 'Casual',
    'menu.travel': 'Travel',
    'menu.cta.exploreClothing': 'Explore Clothing',

    // Mega Menu - Accessories
    'menu.jewelry': 'Jewelry',
    'menu.scarves': 'Scarves',
    'menu.belts': 'Belts',
    'menu.sunglasses': 'Sunglasses',
    'menu.leatherGoods': 'Small Leather Goods',
    'menu.hair': 'Hair Accessories',
    'menu.cta.shopAccessories': 'Shop Accessories',

    // The Edit
    'menu.workwearEssentials': 'Workwear Essentials',
    'menu.minimalStaples': 'Minimal Staples',
    'menu.signatureLooks': 'Signature Looks',
    'menu.taupeEdit': 'Taupe Edit',
    'menu.everydayElegance': 'Everyday Elegance',
    'menu.cta.shopTheEdit': 'Shop The Edit',

    // Collections
    'menu.capsule': 'Capsule Collection',
    'menu.seasonal': 'Seasonal Collection',
    'menu.limited': 'Limited Edition',
    'menu.cta.exploreCollections': 'Explore Collections',

    // Product Page (Additional)
    'pdp.addToBag': 'Add to Bag',
    'pdp.details': 'Product Details',
    'pdp.material': 'Material & Care',
    'pdp.delivery': 'Delivery & Returns',
    'pdp.complete': 'Complete the Look',
    'pdp.selectSize': 'Please select a size',

    // Checkout (Additional)
    'checkout.summary': 'Order Summary',
    'checkout.subtotal': 'Subtotal',
    'checkout.shipping': 'Shipping & Taxes Calculated at Checkout',
    'checkout.checkout': 'Continue to Checkout',
  },
  AR: {
    // Navigation
    'nav.shop': 'تسوّق',
    'nav.collections': 'المجموعات',
    'nav.newIn': 'وصل حديثاً',
    'nav.designers': 'المصممون',
    'nav.clothing': 'ملابس',
    'nav.shoes': 'أحذية',
    'nav.home': 'الرئيسية',
    'nav.sale': 'تخفيضات',
    'nav.journal': 'المجلة',
    'nav.about': 'من نحن',

    // Header & Actions
    'header.search': 'بحث',
    'header.cart': 'السلة',
    'header.account': 'حسابي',
    'header.menu': 'القائمة',

    // Hero
    'hero.cta': 'استكشفي المجموعة',
    'hero.scroll': 'مرّر',

    // Status Banner
    'banner.shipping': 'شحن مجاني للطلبات فوق ٣٠٠ ر.س',

    // Homepage Sections
    'home.categorySlider': 'المجموعات',
    'home.editorial': 'اختيارات المحرر',
    'home.brandIntro': 'فورميه هاوس وجهة منسّقة مستوحاة من الأناقة العصرية والتفاصيل الراقية والاختيار المدروس.',
    'home.curatedForYou': 'حيث تبدأ الأناقة',
    'home.journal': 'المجلة',
    'home.editorial.label': 'تحريري',
    'home.newsletter.title': 'قريباً في المملكة العربية السعودية',
    'home.newsletter.subtitle': 'سجّلي لتصلك آخر التحديثات الحصرية',
    'home.shopCollection': 'تسوّق المجموعة',

    // Journal
    'journal.modernWardrobe': 'تحرير خزانة الملابس العصرية',
    'journal.everydayElegance': 'أناقة يومية',
    'journal.behindCraft': 'وراء الاختيار',

    // Footer
    'footer.followUs': 'تابعينا',
    'footer.mobileApp': 'تطبيق الجوال',
    'footer.comingSoon': 'قريباً',
    'footer.crNo': 'السجل التجاري',
    'footer.vatNo': 'الرقم الضريبي',
    'footer.vatCertificate': 'شهادة ضريبة القيمة المضافة',
    'footer.crCertificate': 'شهادة السجل التجاري',
    'footer.description': 'حيث يلتقي الجوهر بالأناقة',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.paymentMethods': 'طرق الدفع الآمنة',

    // Newsletter / Notify
    'notify.email': 'أدخلي بريدك الإلكتروني',
    'notify.submit': 'أعلميني',
    'notify.success': 'شكراً! سنبقيك على اطلاع.',

    // Product
    'product.addToCart': 'أضيفي إلى السلة',
    'product.soldOut': 'نفذت الكمية',
    'product.sale': 'تخفيض',
    'product.new': 'جديد',

    // Collection
    'collection.loading': 'جاري التحميل...',
    'collection.loadPrevious': 'تحميل السابق',
    'collection.loadMore': 'تحميل المزيد',
    'collection.noProducts': 'لم يتم العثور على منتجات في هذه المجموعة.',
    'collection.price': 'السعر',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.emptyStats': 'يبدو أنك لم تُضيفي أي شيء بعد، دعينا نبدأ!',
    'cart.continueShopping': 'تابعي التسوق',
    'cart.checkout': 'إتمام الشراء',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.saudiAddr': 'للعملاء في المملكة: يُرجى استخدام العنوان الوطني المكوّن من 8 أرقام لضمان التوصيل.',
    'cart.terms': 'بإتمام الشراء، أنتِ توافقين على',
    'cart.termsLink': 'شروط الخدمة',
    'cart.refunds': 'وتُقرّين بمعرفتك بـ',
    'cart.refundsLink': 'سياسة الاسترجاع',
    'cart.refundsNote': '(استرجاع خلال ٧ أيام).',
    'cart.discount': 'كود الخصم',
    'cart.applyDiscount': 'تطبيق الخصم',
    'cart.shopBestSellers': 'تسوّقي الأكثر مبيعاً',
    'cart.vatIncluded': '(شامل ضريبة القيمة المضافة)',

    // Search
    'search.placeholder': 'ابحثي عن المنتجات...',
    'search.noResults': 'لم يتم العثور على نتائج',

    // Product Card
    'product.viewDetails': 'عرض التفاصيل',
    'product.comingSoon': 'قريباً',
    'product.details': 'تفاصيل المنتج',
    'product.shipping': 'الشحن',
    'product.returns': 'الاسترجاع',
    'product.quickAdd': 'إضافة سريعة',

    // General
    'general.viewAll': 'عرض الكل',
    'general.learnMore': 'اعرفي المزيد',
    'general.backToHome': 'العودة للرئيسية',

    // Mega Menu - subsections
    'menu.newArrivals': 'وصل جديد',
    'menu.signaturePieces': 'قطع مميزة',
    'menu.weeklyHighlights': 'مختارات الأسبوع',
    'menu.bestSellers': 'الأكثر طلبًا',
    'menu.cta.shopNewIn': 'تسوقي الجديد',

    // Mega Menu - categories
    'menu.dresses': 'فساتين',
    'menu.tops': 'بلوزات',
    'menu.shirts': 'قمصان',
    'menu.blazers': 'بليزرات',
    'menu.trousers': 'سراويل',
    'menu.skirts': 'تنانير',
    'menu.knitwear': 'قطَع محاكة',
    'menu.outerwear': 'معاطف',

    // Occasions
    'menu.workwear': 'للعمل',
    'menu.evening': 'للمساء',
    'menu.casual': 'كاجوال',
    'menu.travel': 'للسفر',
    'menu.cta.exploreClothing': 'اكتشفي ملابس العمل',

    // Mega Menu - Accessories
    'menu.jewelry': 'مجوهرات',
    'menu.scarves': 'أوشحة',
    'menu.belts': 'أحزمة',
    'menu.sunglasses': 'نظارات شمسية',
    'menu.leatherGoods': 'إكسسوارات جلدية',
    'menu.hair': 'إكسسوارات شعر',
    'menu.cta.shopAccessories': 'تسوقي الإكسسوارات',

    // The Edit
    'menu.workwearEssentials': 'أساسيات العمل',
    'menu.minimalStaples': 'القطع الأساسية',
    'menu.signatureLooks': 'إطلالات مميزة',
    'menu.taupeEdit': 'مختارات التوب',
    'menu.everydayElegance': 'أناقة يومية',
    'menu.cta.shopTheEdit': 'تسوقي المختارات',

    // Collections
    'menu.capsule': 'مجموعات كبسولة',
    'menu.seasonal': 'مجموعة الموسم',
    'menu.limited': 'إصدار محدود',
    'menu.cta.exploreCollections': 'استكشفي المجموعات',

    // Product Page (Additional)
    'pdp.addToBag': 'أضيفي للحقيبة',
    'pdp.details': 'تفاصيل القطعة',
    'pdp.material': 'الخامة والعناية',
    'pdp.delivery': 'التوصيل والاسترجاع',
    'pdp.complete': 'نسقي الإطلالة',
    'pdp.selectSize': 'الرجاء اختيار المقاس',

    // Checkout (Additional)
    'checkout.summary': 'ملخص الطلب',
    'checkout.subtotal': 'المجموع الجزئي',
    'checkout.shipping': 'التوصيل والضرائب تُحسب عند الدفع',
    'checkout.checkout': 'متابعة الدفع',
  },
} as const;
