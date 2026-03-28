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
    'nav.newIn': 'New to Haus',
    'nav.designers': 'Designers',
    'nav.clothing': 'Clothing',
    'nav.shoes': 'Shoes',
    'nav.home': 'Home',
    'nav.sale': 'Sale',
    'nav.journal': 'Journal',
    'nav.about': 'Our Story',
    'nav.contact': 'Contact Us',
    'nav.phoneCases': 'Phone Cases',
    'nav.sunglasses': 'Sunglasses',
    'nav.ourStory': 'Our Story',
    'nav.menu': 'Menu',
    'nav.search': 'Search',
    'nav.account': 'Account',
    'nav.cart': 'Bag',

    // Header & Actions
    'header.search': 'Search',
    'header.cart': 'Shopping Bag',
    'header.account': 'My Account',
    'header.menu': 'Menu',

    // Hero
    'hero.cta': 'Explore the Collection',
    'hero.scroll': 'Scroll',

    // Status Banner
    'banner.shipping': 'Complimentary Global Shipping over 300 SAR',

    // Homepage Sections
    'home.categorySlider': 'The Collections',
    'home.editorial': 'The Edit',
    'home.brandIntro':
      'Formé Haus is a curated destination inspired by modern elegance, refined detail, and thoughtful selection.',
    'home.curatedForYou': 'Where Elegance Begins',
    'home.journal': 'Journal',
    'home.editorial.label': 'Editorial',
    'home.newsletter.title': 'Stay Connected',
    'home.newsletter.subtitle': 'Join for exclusive updates and new arrivals',
    'home.shopCollection': 'Shop Collection',

    // Top Bar
    'topBar.promo': 'Free shipping on orders over 299 SAR',

    // Stats Section
    'stats.title': 'Our Numbers',

    // FAQ Section
    'faq.title': 'FAQs',
    'faq.subtitle':
      'Here are answers to our most common questions. If you need further help, feel free to reach out.',
    'faq.stillHaveQuestions': 'Still have questions?',
    'faq.contactUs': 'Contact Us',

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
    'footer.contact': 'Contact us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.paymentMethods': 'Secure Payment Methods',
    'footer.newsletter': 'Join the Haus',
    'footer.newsletterDesc': 'New arrivals, exclusive offers, and more.',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.submitting': 'Sending...',
    'footer.subscribe': 'Join',
    'footer.shipping': 'Shipping & Delivery Policy',
    'footer.returns': 'Return & Exchange Policy',
    'footer.registered': 'Registered in Saudi Arabia',

    // Newsletter / Notify
    'notify.email': 'Enter your email',
    'notify.submit': 'Notify Me',
    'notify.success': "Thank you! We'll keep you updated.",

    // Product
    'product.addToCart': 'Add to Bag',
    'product.soldOut': 'Sold Out',
    'product.sale': 'Sale',
    'product.new': 'New',

    // Collection
    'collection.loading': 'Loading...',
    'collection.loadPrevious': 'Load previous',
    'collection.loadMore': 'Load more products',
    'collection.noProducts': 'No products found in this collection.',
    'collection.price': 'Price',
    'collection.item': 'Item',
    'collection.items': 'Items',

    // Cart
    'cart.title': 'Your Bag',
    'cart.empty': 'Your bag is empty',
    'cart.emptyStats':
      "Looks like you haven't added anything yet, let's get you started!",
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.saudiAddr':
      'For Saudi Arabia: Please use your 8-digit National Address to ensure delivery.',
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
    'product.addToWishlist': 'Save to Wishlist',
    'product.removeFromWishlist': 'Remove from Wishlist',
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
    'common.close': 'Close',
    country: 'Saudi Arabia',

    // Mega Menu
    'menu.title': 'Menu',
    'menu.explore': 'Explore',
    'menu.viewAll': 'View All',
    'menu.stores': 'Find a Store',
    'menu.collection': 'Collection',
    'menu.comingSoon': 'Coming Soon',
    'menu.services': 'Services',
    // Mega Menu - subsections (New In)
    'menu.newArrivals': 'New Arrivals',
    'menu.signaturePieces': 'Signature Pieces',
    'menu.weeklyHighlights': 'Weekly Highlights',
    'menu.bestSellers': 'Best Sellers',
    'menu.cta.shopNewIn': 'Shop New to Haus',

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
    'menu.cta.exploreCollections': 'Explore the Collection',

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

    // Category Bento
    'category.newInHaus': 'New to Haus',
    'category.phoneAccessories': 'Phone Accessories',
    'home.shopByCategory': 'Shop by Category',

    // Bundle Pricing
    'bundle.oneItem': 'One piece',
    'bundle.twoItems': 'Two pieces',
    'bundle.threeItems': 'Three pieces',
    'bundle.caseOnly': 'Case only',
    'bundle.caseAndStrap': 'Case + Strap',
    'bundle.save15': 'Save 15%',
    'bundle.fullBundle': 'Complete Bundle',
    'bundle.save20': 'Save 20%',
    'bundle.bestValue': 'Best Value',
    'bundle.bestSeller': 'Best Seller',
    'bundle.savings': 'Bundle Savings',
    'bundle.tieredDiscount': '2+ items: 10% off',
    'bundle.chooseQty': 'Choose quantity (discount applies)',
    'bundle.off': 'OFF',
    'bundle.savingAmount': 'Saving',
    'bundle.chooseBundle': 'Choose Your Bundle',
    'bundle.saveMoreWithBundles': 'Save more with bundles',
    'bundle.freeShipping': 'Free Shipping',
    'bundle.giftWrap': 'Gift Wrap',
    'bundle.easyReturns': 'Easy Returns',

    // Stats Section (Detail)
    'stats.happyCustomer': 'Happy Customer',
    'stats.premiumProduct': 'Premium Product',
    'stats.city': 'City',
    'stats.satisfactionRate': 'Satisfaction Rate',
    'stats.numbersSpeak': 'Our Numbers Speak',

    // Trust Badges
    'trust.maroof': 'Maroof',
    'trust.trusted': 'Trusted',
    'trust.maroofVerified': 'Maroof Verified Store',
    'trust.securePayment': 'Secure Payment',
    'trust.shopWithConfidence': 'Shop with Confidence',
    'trust.trialReady': 'Trial Ready',
    'trust.fastDelivery': 'Fast Delivery',
    'trust.paymentMethods':
      'Multiple payment methods via Tap: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, Tamara',

    // Why Choose Us
    'whyUs.title': 'Why Choose Us',
    'whyUs.curatedTitle': 'Curated Selection',
    'whyUs.curatedDesc':
      'Global designers carefully selected for sophistication and timeless design.',
    'whyUs.limitedTitle': 'Limited Collections',
    'whyUs.limitedDesc': 'Carefully selected limited-run releases.',
    'whyUs.globalTitle': 'Global Designers',
    'whyUs.globalDesc':
      'A curated mix of emerging and established brands worldwide.',
    'whyUs.elevatedTitle': 'Elevated Experience',
    'whyUs.elevatedDesc':
      'An elevated journey from discovery to delivery. Free shipping across Saudi Arabia.',

    // Account
    'account.overview': 'Overview',
    'account.orders': 'Orders',
    'account.profile': 'Profile',
    'account.addresses': 'Addresses',
    'account.welcomeBack': 'Welcome back',
    'account.memberSince': 'Member since',
    'account.signOut': 'Sign Out',
    'account.totalOrders': 'Total Orders',
    'account.totalSpent': 'Total Spent',
    'account.savedAddresses': 'Saved Addresses',
    'account.recentOrders': 'Recent Orders',
    'account.noOrders': 'No orders yet',
    'account.startShopping': 'Start Shopping',
    'account.editProfile': 'Edit Profile',
    'account.addAddress': 'Add Address',
    'account.orderHistory': 'Order History',
    'account.edit': 'Edit',
    'account.name': 'Name',
    'account.email': 'Email',
    'account.phone': 'Phone',
    'account.noAddresses': 'No addresses saved yet',
    'account.contactUs': 'Contact Us',
    'account.returns': 'Returns',

    // Products Index
    'products.completeCollection': 'The Complete Collection',
    'products.allProducts': 'All Products',
    'products.browseAll': 'Browse All',

    // Showcase
    'showcase.collection': 'The Collection',
    'showcase.subtitle': 'Discover all our unique products',
    'showcase.dragToBrowse': 'Drag to browse',
    'showcase.products': 'Products',

    // Accessibility
    'a11y.switchToArabic': 'Switch to Arabic',
    'a11y.mainNavigation': 'Main navigation',
    'a11y.whatsappContact': 'Contact us on WhatsApp',

    // Language
    'language.arabic': 'Arabic',

    // WhatsApp
    'whatsapp.defaultMessage':
      'Hello, I would like to enquire about a product at Formé Haus',

    // Mobile Bottom Nav
    'nav.saved': 'Saved',
    'nav.shopLabel': 'Shop',
  },
  AR: {
    // Navigation
    'nav.shop': 'تسوّق',
    'nav.collections': 'المجموعات',
    'nav.newIn': 'وصل حديثاً',
    'nav.designers': 'المصمّمون',
    'nav.clothing': 'ملابس',
    'nav.shoes': 'أحذية',
    'nav.home': 'الرئيسية',
    'nav.sale': 'تخفيضات',
    'nav.journal': 'المجلة',
    'nav.about': 'قصتنا',
    'nav.contact': 'تواصل معنا',
    'nav.phoneCases': 'كفرات الجوال',
    'nav.sunglasses': 'نظارات شمسية',
    'nav.ourStory': 'قصتنا',
    'nav.menu': 'القائمة',
    'nav.search': 'بحث',
    'nav.account': 'حسابي',
    'nav.cart': 'الحقيبة',

    // Header & Actions
    'header.search': 'بحث',
    'header.cart': 'الحقيبة',
    'header.account': 'حسابي',
    'header.menu': 'القائمة',

    // Hero
    'hero.cta': 'استكشفي المجموعة',
    'hero.scroll': 'مرّر',

    // Status Banner
    'banner.shipping': 'شحن مجاني عالمي للطلبات فوق 300 ر.س',

    // Homepage Sections
    'home.categorySlider': 'المجموعات',
    'home.editorial': 'المختارات',
    'home.brandIntro':
      'Formé Haus وجهة منسّقة مستوحاة من الأناقة العصرية والتفاصيل الراقية والاختيار المدروس.',
    'home.curatedForYou': 'حيث تبدأ الأناقة',
    'home.journal': 'المجلة',
    'home.editorial.label': 'Editorial',
    'home.newsletter.title': 'ابقَ على تواصل',
    'home.newsletter.subtitle': 'انضم لتصلك آخر التحديثات والوصولات الجديدة',
    'home.shopCollection': 'تسوّق المجموعة',

    // Top Bar
    'topBar.promo': 'شحن مجاني للطلبات فوق 300 ر.س',

    // Stats Section
    'stats.title': 'أرقامنا',

    // FAQ Section
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle':
      'إليك الإجابات على الأسئلة الأكثر شيوعاً. إذا كنت بحاجة إلى مزيد من المساعدة، لا تتردد في التواصل معنا.',
    'faq.stillHaveQuestions': 'هل لديك أسئلة أخرى؟',
    'faq.contactUs': 'تواصل معنا',

    // Journal
    'journal.modernWardrobe': 'مختارات الخزانة العصرية',
    'journal.everydayElegance': 'أناقة يومية',
    'journal.behindCraft': 'قصة الاختيار',

    // Footer
    'footer.followUs': 'تابعونا',
    'footer.mobileApp': 'تطبيق الجوال',
    'footer.comingSoon': 'قريباً',
    'footer.crNo': 'السجل التجاري',
    'footer.vatNo': 'الرقم الضريبي',
    'footer.vatCertificate': 'شهادة ضريبة القيمة المضافة',
    'footer.crCertificate': 'شهادة السجل التجاري',
    'footer.description': 'حيث يلتقي الجوهر بالأناقة',
    'footer.contact': 'تواصل معنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام',
    'footer.paymentMethods': 'طرق الدفع الآمنة',
    'footer.newsletter': 'انضم إلى عالم Haus',
    'footer.newsletterDesc': 'وصل حديثاً، عروض حصرية، والمزيد.',
    'footer.emailPlaceholder': 'البريد الإلكتروني',
    'footer.submitting': 'جارٍ الإرسال...',
    'footer.subscribe': 'اشتراك',
    'footer.shipping': 'سياسة الشحن والتوصيل',
    'footer.returns': 'سياسة الاسترجاع والاستبدال',
    'footer.registered': 'مسجّل في المملكة العربية السعودية',

    // Newsletter / Notify
    'notify.email': 'البريد الإلكتروني',
    'notify.submit': 'أعلمني',
    'notify.success': 'شكراً! سنُعلمك عند التوفر.',

    // Product
    'product.addToCart': 'أضيفي إلى الحقيبة',
    'product.soldOut': 'نفدت الكمية',
    'product.sale': 'تخفيض',
    'product.new': 'جديد',

    // Collection
    'collection.loading': 'جارٍ التحميل...',
    'collection.loadPrevious': 'تحميل السابق',
    'collection.loadMore': 'تحميل المزيد',
    'collection.noProducts': 'لا توجد منتجات في هذه المجموعة.',
    'collection.price': 'السعر',
    'collection.item': 'قطعة',
    'collection.items': 'قطع',

    // Cart
    'cart.title': 'حقيبتك',
    'cart.empty': 'حقيبتك فارغة',
    'cart.emptyStats': 'يبدو أنك لم تُضف شيئاً بعد. اكتشف مجموعتنا!',
    'cart.continueShopping': 'تابعي التسوق',
    'cart.checkout': 'إتمام الشراء',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.saudiAddr':
      'للعملاء في المملكة: يُرجى إدخال الرمز البريدي أو العنوان الوطني لضمان التوصيل.',
    'cart.terms': 'بإتمام الشراء، فإنك توافق على',
    'cart.termsLink': 'شروط الخدمة',
    'cart.refunds': 'وتُقرّ باطلاعك على',
    'cart.refundsLink': 'حقوق المستهلك',
    'cart.refundsNote': '(استرجاع خلال 7 أيام).',
    'cart.discount': 'كود الخصم',
    'cart.applyDiscount': 'تطبيق الخصم',
    'cart.shopBestSellers': 'تسوّقي الأكثر مبيعاً',
    'cart.vatIncluded': '(شامل ضريبة القيمة المضافة)',

    // Search
    'search.placeholder': 'ابحث عن منتجات...',
    'search.noResults': 'لا توجد نتائج',

    // Product Card
    'product.addToWishlist': 'أضيفي للمفضلة',
    'product.removeFromWishlist': 'إزالة من المفضلة',
    'product.viewDetails': 'عرض التفاصيل',
    'product.comingSoon': 'قريباً',
    'product.details': 'تفاصيل المنتج',
    'product.shipping': 'الشحن',
    'product.returns': 'الاسترجاع',
    'product.quickAdd': 'إضافة سريعة',

    // General
    'general.viewAll': 'عرض الكل',
    'general.learnMore': 'اعرف المزيد',
    'general.backToHome': 'العودة للرئيسية',
    'common.close': 'إغلاق',
    country: 'السعودية',

    // Mega Menu
    'menu.title': 'القائمة',
    'menu.explore': 'استكشف',
    'menu.viewAll': 'عرض الكل',
    'menu.stores': 'البحث عن متجر',
    'menu.collection': 'مجموعة',
    'menu.comingSoon': 'قريباً',
    'menu.services': 'الخدمات',
    // Mega Menu - subsections
    'menu.newArrivals': 'وصل حديثاً',
    'menu.signaturePieces': 'قطع مميزة',
    'menu.weeklyHighlights': 'مختارات الأسبوع',
    'menu.bestSellers': 'الأكثر مبيعاً',
    'menu.cta.shopNewIn': 'تسوّق الجديد',

    // Mega Menu - categories
    'menu.dresses': 'فساتين',
    'menu.tops': 'بلوزات',
    'menu.shirts': 'قمصان',
    'menu.blazers': 'بليزرات',
    'menu.trousers': 'سراويل',
    'menu.skirts': 'تنانير',
    'menu.knitwear': 'تريكو',
    'menu.outerwear': 'معاطف',

    // Occasions
    'menu.workwear': 'للعمل',
    'menu.evening': 'للمساء',
    'menu.casual': 'كاجوال',
    'menu.travel': 'للسفر',
    'menu.cta.exploreClothing': 'اكتشف الملابس',

    // Mega Menu - Accessories
    'menu.jewelry': 'مجوهرات',
    'menu.scarves': 'أوشحة',
    'menu.belts': 'أحزمة',
    'menu.sunglasses': 'نظارات شمسية',
    'menu.leatherGoods': 'إكسسوارات جلدية',
    'menu.hair': 'إكسسوارات شعر',
    'menu.cta.shopAccessories': 'تسوّق الإكسسوارات',

    // The Edit
    'menu.workwearEssentials': 'أساسيات العمل',
    'menu.minimalStaples': 'القطع الأساسية',
    'menu.signatureLooks': 'إطلالات مميزة',
    'menu.taupeEdit': 'مختارات البيج',
    'menu.everydayElegance': 'أناقة يومية',
    'menu.cta.shopTheEdit': 'تسوّق المختارات',

    // Collections
    'menu.capsule': 'مجموعة كبسولة',
    'menu.seasonal': 'مجموعة الموسم',
    'menu.limited': 'إصدار محدود',
    'menu.cta.exploreCollections': 'استكشف المجموعات',

    // Product Page (Additional)
    'pdp.addToBag': 'أضف إلى الحقيبة',
    'pdp.details': 'تفاصيل المنتج',
    'pdp.material': 'الخامة والعناية',
    'pdp.delivery': 'التوصيل والاسترجاع',
    'pdp.complete': 'أكمل الإطلالة',
    'pdp.selectSize': 'الرجاء اختيار المقاس',

    // Checkout (Additional)
    'checkout.summary': 'ملخص الطلب',
    'checkout.subtotal': 'المجموع الفرعي',
    'checkout.shipping': 'التوصيل والضرائب تُحسب عند الدفع',
    'checkout.checkout': 'إتمام الطلب',

    // Category Bento
    'category.newInHaus': 'جديد في Haus',
    'category.phoneAccessories': 'إكسسوارات الجوال',
    'home.shopByCategory': 'تسوّق حسب الفئة',

    // Bundle Pricing
    'bundle.oneItem': 'قطعة واحدة',
    'bundle.twoItems': 'قطعتان',
    'bundle.threeItems': 'ثلاث قطع',
    'bundle.caseOnly': 'الكفر فقط',
    'bundle.caseAndStrap': 'كفر + حزام',
    'bundle.save15': 'وفّر 15%',
    'bundle.fullBundle': 'المجموعة الكاملة',
    'bundle.save20': 'وفّر 20%',
    'bundle.bestValue': 'أفضل قيمة',
    'bundle.bestSeller': 'الأكثر مبيعاً',
    'bundle.savings': 'خصم على الكمية',
    'bundle.tieredDiscount': '2+ قطع: خصم 10%',
    'bundle.chooseQty': 'اختر الكمية (يتوفر خصم)',
    'bundle.off': 'خصم',
    'bundle.savingAmount': 'توفير',
    'bundle.chooseBundle': 'اختر الباقة',
    'bundle.saveMoreWithBundles': 'وفّر أكثر مع الباقات',
    'bundle.freeShipping': 'شحن مجاني',
    'bundle.giftWrap': 'تغليف هدية',
    'bundle.easyReturns': 'إرجاع سهل',

    // Stats Section (Detail)
    'stats.happyCustomer': 'عميل سعيد',
    'stats.premiumProduct': 'منتج متميز',
    'stats.city': 'مدينة',
    'stats.satisfactionRate': 'نسبة الرضا',
    'stats.numbersSpeak': 'أرقامنا تتحدث',

    // Trust Badges
    'trust.maroof': 'معروف',
    'trust.trusted': 'موثوق',
    'trust.maroofVerified': 'متجر معتمد من معروف',
    'trust.securePayment': 'دفع آمن',
    'trust.shopWithConfidence': 'تسوّق بثقة',
    'trust.trialReady': 'جاهز للتجربة',
    'trust.fastDelivery': 'توصيل سريع',
    'trust.paymentMethods':
      'طرق دفع متعددة عبر Tap: مدى، فيزا، ماستركارد، آبل باي، STC Pay، تابي، تمارا',

    // Why Choose Us
    'whyUs.title': 'لماذا تختارنا',
    'whyUs.curatedTitle': 'اختيار منسّق',
    'whyUs.curatedDesc':
      'مصممون عالميون تم اختيارهم بعناية للرقي والتصميم الدائم.',
    'whyUs.limitedTitle': 'مجموعات محدودة',
    'whyUs.limitedDesc': 'إصدارات مختارة بعناية بكميات محدودة.',
    'whyUs.globalTitle': 'مصممون عالميون',
    'whyUs.globalDesc': 'مزيج منسّق من العلامات الناشئة والراسخة حول العالم.',
    'whyUs.elevatedTitle': 'تجربة راقية',
    'whyUs.elevatedDesc':
      'رحلة راقية من الاكتشاف إلى التوصيل. شحن مجاني في جميع أنحاء السعودية.',

    // Account
    'account.overview': 'نظرة عامة',
    'account.orders': 'الطلبات',
    'account.profile': 'الملف الشخصي',
    'account.addresses': 'العناوين',
    'account.welcomeBack': 'أهلاً بك',
    'account.memberSince': 'عضو منذ',
    'account.signOut': 'تسجيل الخروج',
    'account.totalOrders': 'إجمالي الطلبات',
    'account.totalSpent': 'إجمالي الإنفاق',
    'account.savedAddresses': 'العناوين المحفوظة',
    'account.recentOrders': 'آخر الطلبات',
    'account.noOrders': 'لا توجد طلبات حتى الآن',
    'account.startShopping': 'تسوّق الآن',
    'account.editProfile': 'تعديل الملف',
    'account.addAddress': 'إضافة عنوان',
    'account.orderHistory': 'سجل الطلبات',
    'account.edit': 'تعديل',
    'account.name': 'الاسم',
    'account.email': 'البريد الإلكتروني',
    'account.phone': 'رقم الهاتف',
    'account.noAddresses': 'لم تُحفظ أي عناوين بعد',
    'account.contactUs': 'التواصل معنا',
    'account.returns': 'سياسة الإرجاع',

    // Products Index
    'products.completeCollection': 'المجموعة الكاملة',
    'products.allProducts': 'جميع المنتجات',
    'products.browseAll': 'تصفح الكل',

    // Showcase
    'showcase.collection': 'المجموعة',
    'showcase.subtitle': 'اكتشف جميع منتجاتنا الفريدة',
    'showcase.dragToBrowse': 'اسحب للتصفح',
    'showcase.products': 'منتج',

    // Accessibility
    'a11y.switchToArabic': 'التبديل إلى العربية',
    'a11y.mainNavigation': 'التنقل الرئيسي',
    'a11y.whatsappContact': 'تواصل معنا عبر واتساب',

    // Language
    'language.arabic': 'عربي',

    // WhatsApp
    'whatsapp.defaultMessage': 'مرحباً، أريد الاستفسار عن منتج في Formé Haus',

    // Mobile Bottom Nav
    'nav.saved': 'المفضلة',
    'nav.shopLabel': 'التشكيلات',
  },
} as const;
