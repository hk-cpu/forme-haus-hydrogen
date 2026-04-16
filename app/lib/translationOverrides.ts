export const translationOverrides = {
  EN: {
    // Add EN overrides if needed later
  },
  AR: {
    'hero.h1': 'فورمي هاوس - أغطية هواتف ونظارات شمسية في السعودية',
    'brand.tagline': 'حيث يلتقي الجوهر بالأناقة',
    'home.journal': 'المجلة',
    'journal.read': 'قراءة المجلة',
    'journal.modernWardrobe': 'مختارات الخزانة العصرية',
    'journal.modernWardrobe.subtitle':
      'خزانة تصنعها وضوح الرؤية والذوق المصفّى.',
    'journal.everydayElegance': 'أناقة كل يوم',
    'journal.everydayElegance.subtitle':
      'الأناقة تُعاش في التفاصيل وبين اللحظات.',
    'journal.behindCraft': 'خلف الاختيار',
    'journal.behindCraft.subtitle': 'كل قطعة تبدأ بعناية وتأمل.',
    'footer.crNo': 'رقم السجل التجاري',
    'footer.vatNo': 'الرقم الضريبي',
    'footer.poweredByTap': 'مدعوم من تاب للدفع · تشفير SSL ‏256-بت',
    'trust.maroofVerified': 'متجر معروف موثق',
    'trust.muwathooqTrusted': 'موثوق للمستهلك',
    'trust.securePayment': 'دفع آمن',
    'trust.shopWithConfidence': 'تسوّق بثقة',
    'trust.paymentMethods':
      'طرق دفع متعددة عبر تاب: مدى، فيزا، ماستركارد، آبل باي، stc pay، تابي، تمارا',
  },
} as const;

export type OverrideKey = keyof typeof translationOverrides.EN;
