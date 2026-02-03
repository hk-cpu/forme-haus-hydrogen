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
    'nav.collections': 'Collections',
    'nav.newIn': 'New In',
    'nav.designers': 'Designers',
    'nav.clothing': 'Clothing',
    'nav.shoes': 'Shoes',
    'nav.sale': 'Sale',
    'nav.journal': 'Journal',
    'nav.about': 'About',

    // Header & Actions
    'header.search': 'Search',
    'header.cart': 'Cart',
    'header.account': 'Account',
    'header.menu': 'Menu',

    // Hero
    'hero.cta': 'Explore Collection',
    'hero.scroll': 'Scroll',

    // Status Banner
    'banner.shipping': 'Complimentary Global Shipping over 300 SAR',

    // Homepage Sections
    'home.categorySlider': 'Shop by Category',
    'home.editorial': 'The Edit',
    'home.brandIntro': 'Formé Haus is a Saudi-based womenswear label rooted in modern elegance, refined silhouettes, and thoughtful craftsmanship.',
    'home.curatedForYou': 'Curated For You',
    'home.journal': 'Journal',
    'home.editorial.label': 'Editorial',
    'home.newsletter.title': 'Launching soon in Saudi Arabia',
    'home.newsletter.subtitle': 'Join the list for exclusive updates',
    'home.shopCollection': 'Shop Collection',

    // Journal
    'journal.modernWardrobe': 'A Modern Saudi Wardrobe',
    'journal.everydayElegance': 'Designing for Everyday Elegance',
    'journal.behindCraft': 'Behind the Craft',

    // Footer
    'footer.followUs': 'Follow Us',
    'footer.mobileApp': 'Mobile App',
    'footer.comingSoon': 'Coming Soon',
    'footer.crNo': 'CR No.',
    'footer.vatNo': 'VAT No.',
    'footer.vatCertificate': 'VAT Certificate',
    'footer.crCertificate': 'CR Certificate',

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

    // General
    'general.viewAll': 'View All',
    'general.learnMore': 'Learn More',
    'general.backToHome': 'Back to Home',
  },
  AR: {
    // Navigation
    'nav.shop': 'تسوّق',
    'nav.collections': 'المجموعات',
    'nav.newIn': 'وصل حديثاً',
    'nav.designers': 'المصممون',
    'nav.clothing': 'ملابس',
    'nav.shoes': 'أحذية',
    'nav.sale': 'تخفيضات',
    'nav.journal': 'المجلة',
    'nav.about': 'من نحن',

    // Header & Actions
    'header.search': 'بحث',
    'header.cart': 'السلة',
    'header.account': 'حسابي',
    'header.menu': 'القائمة',

    // Hero
    'hero.cta': 'استكشف المجموعة',
    'hero.scroll': 'مرّر',

    // Status Banner
    'banner.shipping': 'شحن مجاني للطلبات فوق ٣٠٠ ر.س',

    // Homepage Sections
    'home.categorySlider': 'تسوّق حسب الفئة',
    'home.editorial': 'اختيارات المحرر',
    'home.brandIntro': 'فورميه هاوس علامة أزياء نسائية سعودية تجمع بين الأناقة العصرية والتصميمات الراقية والحرفية المتقنة.',
    'home.curatedForYou': 'مختارة لكِ',
    'home.journal': 'المجلة',
    'home.editorial.label': 'تحريري',
    'home.newsletter.title': 'قريباً في المملكة العربية السعودية',
    'home.newsletter.subtitle': 'سجّلي لتصلك آخر التحديثات الحصرية',
    'home.shopCollection': 'تسوّق المجموعة',

    // Journal
    'journal.modernWardrobe': 'خزانة ملابس سعودية عصرية',
    'journal.everydayElegance': 'تصميم الأناقة اليومية',
    'journal.behindCraft': 'وراء الحرفة',

    // Footer
    'footer.followUs': 'تابعينا',
    'footer.mobileApp': 'تطبيق الجوال',
    'footer.comingSoon': 'قريباً',
    'footer.crNo': 'السجل التجاري',
    'footer.vatNo': 'الرقم الضريبي',
    'footer.vatCertificate': 'شهادة ضريبة القيمة المضافة',
    'footer.crCertificate': 'شهادة السجل التجاري',

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

    // General
    'general.viewAll': 'عرض الكل',
    'general.learnMore': 'اعرفي المزيد',
    'general.backToHome': 'العودة للرئيسية',
  },
} as const;
