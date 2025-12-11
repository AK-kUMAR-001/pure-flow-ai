/**
 * Language Context
 * Provides multi-language support for English, Hindi, and Tamil
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Supported languages
export type Language = "en" | "hi" | "ta" | "ma";

// Language display names in their native script
export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  ma: "മലയാളം",
};

// Translation keys interface
export interface Translations {
  // Navigation
  nav: {
    home: string;
    services: string;
    homeTest: string;
    bookTest: string;
    about: string;
    contact: string;
    login: string;
    dashboard: string;
  };
  // Hero Section
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    cta: string;
    explore: string;
    litersSaved: string;
    happyHomes: string;
    purityRate: string;
    costSavings: string;
  };
  // Home Test
  homeTest: {
    title: string;
    subtitle: string;
    phLabel: string;
    phPlaceholder: string;
    phIdeal: string;
    tdsLabel: string;
    tdsPlaceholder: string;
    tdsIdeal: string;
    turbidity: string;
    low: string;
    medium: string;
    high: string;
    hardness: string;
    hardnessHint: string;
    softness: string;
    softnessHint: string;
    biological: string;
    biologicalHint: string;
    yes: string;
    no: string;
    analyze: string;
    analyzing: string;
    reset: string;
    results: string;
    ready: string;
    readyDesc: string;
    recommendations: string;
    waterHyacinth: string;
    bananaFiber: string;
    activatedCarbon: string;
    aluminaNanoBeads: string;
  };
  // About Page
  about: {
    title: string;
    subtitle: string;
    ourStory: string;
    storyTitle: string;
    story1: string;
    story2: string;
    story3: string;
    missionTitle: string;
    mission: string;
    visionTitle: string;
    vision: string;
    valuesTitle: string;
    innovators: string;
    innovatorsSubtitle: string;
    impact: string;
    impactSubtitle: string;
    litersRecycled: string;
    happyHomes: string;
    citiesServed: string;
    satisfaction: string;
  };
  // Contact
  contact: {
    title: string;
    subtitle: string;
    call: string;
    whatsapp: string;
    location: string;
    email: string;
  };
  // Booking
  booking: {
    title: string;
    subtitle: string;
    selectSource: string;
    chooseDateTime: string;
    yourDetails: string;
    confirm: string;
    success: string;
  };
  // Common
  common: {
    back: string;
    continue: string;
    submit: string;
    cancel: string;
    loading: string;
    success: string;
    error: string;
    orderCartridge: string;
    newTest: string;
    paymentSuccess: string;
  };
}

// English translations
const en: Translations = {
  nav: {
    home: "Home",
    services: "Services",
    homeTest: "Home Test",
    bookTest: "Book Test",
    about: "About",
    contact: "Contact",
    login: "Login",
    dashboard: "Dashboard",
  },
  hero: {
    badge: "Trusted by 10,000+ households",
    title1: "Transform Your",
    title2: "Grey Water",
    title3: "Into Pure Savings",
    subtitle: "Custom-designed eco-friendly filtration systems that recycle your household grey water. Save money, conserve water, and protect our planet.",
    cta: "Book Free Water Test",
    explore: "Explore Our Services",
    litersSaved: "Liters Saved",
    happyHomes: "Happy Homes",
    purityRate: "Purity Rate",
    costSavings: "Cost Savings",
  },
  homeTest: {
    title: "Analyze Your Water Quality",
    subtitle: "Enter your home water test results to get personalized filter material recommendations",
    phLabel: "pH Level",
    phPlaceholder: "Enter pH (0-14)",
    phIdeal: "Ideal range: 6.5 - 8.5",
    tdsLabel: "TDS (Total Dissolved Solids)",
    tdsPlaceholder: "Enter TDS in ppm",
    tdsIdeal: "Ideal: less than 500 ppm",
    turbidity: "Turbidity (Cloudiness)",
    low: "Low",
    medium: "Medium",
    high: "High",
    hardness: "Hardness Present?",
    hardnessHint: "(Scale/deposits on utensils)",
    softness: "Softness Present?",
    softnessHint: "(Slippery feel, lathers easily)",
    biological: "Biological Contaminants?",
    biologicalHint: "(Smell, color, taste issues)",
    yes: "Yes",
    no: "No",
    analyze: "Analyze Water",
    analyzing: "Analyzing...",
    reset: "Reset",
    results: "Analysis Results",
    ready: "Ready to Analyze",
    readyDesc: "Fill in your water test parameters and click \"Analyze\" to get personalized filter recommendations",
    recommendations: "Recommended Filter Materials",
    waterHyacinth: "Water Hyacinth",
    bananaFiber: "Banana Fiber",
    activatedCarbon: "Activated Carbon",
    aluminaNanoBeads: "Alumina Nano Beads",
  },
  about: {
    title: "Pioneering Sustainable",
    subtitle: "Water Solutions",
    ourStory: "Our Story",
    storyTitle: "Born from a Simple Observation",
    story1: "In 2019, our founder noticed something alarming while researching water usage in Indian households: over 100 liters of reusable grey water was being wasted daily per home.",
    story2: "This water from kitchens, washing machines, and showers could be easily recycled for gardening, cleaning, and flushing – but no affordable, customized solution existed.",
    story3: "AquaAdapt was born to fill this gap. Using locally-sourced natural materials like Water Hyacinth, we create custom filtration systems tailored to each household's unique water quality.",
    missionTitle: "Our Mission",
    mission: "To make water recycling accessible, affordable, and effective for every Indian household, reducing freshwater consumption and empowering communities to become water-positive.",
    visionTitle: "Our Vision",
    vision: "A future where every drop counts, where grey water is never wasted, and where sustainable water management is the norm, not the exception.",
    valuesTitle: "What Drives Us Forward",
    innovators: "Our Innovators",
    innovatorsSubtitle: "The minds behind AquaAdapt's innovation",
    impact: "Our Impact So Far",
    impactSubtitle: "Every number represents a step towards a water-secure future",
    litersRecycled: "Liters Recycled",
    happyHomes: "Happy Homes",
    citiesServed: "Cities Served",
    satisfaction: "Satisfaction Rate",
  },
  contact: {
    title: "Get In Touch",
    subtitle: "We're here to help you with all your water filtration needs",
    call: "Call Us",
    whatsapp: "WhatsApp",
    location: "Location",
    email: "Email",
  },
  booking: {
    title: "Book Your Free Water Test",
    subtitle: "Our certified technician will visit your home and analyze your water quality",
    selectSource: "Select Water Source",
    chooseDateTime: "Choose Date & Time",
    yourDetails: "Your Details",
    confirm: "Confirm Booking",
    success: "Booking Confirmed!",
  },
  common: {
    back: "Back",
    continue: "Continue",
    submit: "Submit",
    cancel: "Cancel",
    loading: "Loading...",
    success: "Success!",
    error: "Error",
    orderCartridge: "Order Your Cartridge",
    newTest: "New Test",
    paymentSuccess: "Payment Successful! Your cartridge order has been confirmed. Our team will contact you shortly for setup.",
  },
};

// Hindi translations
const hi: Translations = {
  nav: {
    home: "होम",
    services: "सेवाएं",
    homeTest: "घर टेस्ट",
    bookTest: "टेस्ट बुक करें",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    dashboard: "डैशबोर्ड",
  },
  hero: {
    badge: "10,000+ घरों द्वारा विश्वसनीय",
    title1: "अपने",
    title2: "ग्रे वाटर",
    title3: "को शुद्ध बचत में बदलें",
    subtitle: "कस्टम-डिज़ाइन किए गए पर्यावरण अनुकूल फ़िल्ट्रेशन सिस्टम जो आपके घरेलू ग्रे वाटर को रीसायकल करते हैं। पैसे बचाएं, पानी संरक्षित करें।",
    cta: "मुफ्त पानी टेस्ट बुक करें",
    explore: "हमारी सेवाएं देखें",
    litersSaved: "लीटर बचाए",
    happyHomes: "खुश घर",
    purityRate: "शुद्धता दर",
    costSavings: "लागत बचत",
  },
  homeTest: {
    title: "अपनी पानी की गुणवत्ता का विश्लेषण करें",
    subtitle: "व्यक्तिगत फ़िल्टर सामग्री अनुशंसाएं प्राप्त करने के लिए अपने घर के पानी परीक्षण परिणाम दर्ज करें",
    phLabel: "पीएच स्तर",
    phPlaceholder: "पीएच दर्ज करें (0-14)",
    phIdeal: "आदर्श सीमा: 6.5 - 8.5",
    tdsLabel: "टीडीएस (कुल घुलित ठोस)",
    tdsPlaceholder: "पीपीएम में टीडीएस दर्ज करें",
    tdsIdeal: "आदर्श: 500 पीपीएम से कम",
    turbidity: "गंदलापन (धुंधलापन)",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    hardness: "कठोरता मौजूद?",
    hardnessHint: "(बर्तनों पर जमाव/स्केल)",
    softness: "मुलायमता मौजूद?",
    softnessHint: "(फिसलन, आसानी से झाग)",
    biological: "जैविक प्रदूषक?",
    biologicalHint: "(गंध, रंग, स्वाद की समस्या)",
    yes: "हां",
    no: "नहीं",
    analyze: "पानी का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    reset: "रीसेट",
    results: "विश्लेषण परिणाम",
    ready: "विश्लेषण के लिए तैयार",
    readyDesc: "व्यक्तिगत फ़िल्टर अनुशंसाएं प्राप्त करने के लिए अपने पानी परीक्षण पैरामीटर भरें",
    recommendations: "अनुशंसित फ़िल्टर सामग्री",
    waterHyacinth: "जलकुम्भी",
    bananaFiber: "केले का रेशा",
    activatedCarbon: "सक्रिय कार्बन",
    aluminaNanoBeads: "एलुमिना नैनो बीड्स",
  },
  about: {
    title: "अग्रणी सतत",
    subtitle: "जल समाधान",
    ourStory: "हमारी कहानी",
    storyTitle: "एक साधारण अवलोकन से जन्मा",
    story1: "2019 में, हमारे संस्थापक ने भारतीय घरों में पानी के उपयोग पर शोध करते समय कुछ चिंताजनक देखा: प्रति घर प्रतिदिन 100 लीटर से अधिक पुन: प्रयोग योग्य ग्रे वाटर बर्बाद हो रहा था।",
    story2: "रसोई, वाशिंग मशीन और शावर से यह पानी बागवानी, सफाई और फ्लशिंग के लिए आसानी से रीसायकल किया जा सकता था।",
    story3: "इस अंतर को भरने के लिए एक्वाएडाप्ट का जन्म हुआ। जलकुम्भी जैसी स्थानीय प्राकृतिक सामग्रियों का उपयोग करके, हम प्रत्येक घर की अनूठी जल गुणवत्ता के अनुरूप कस्टम फ़िल्ट्रेशन सिस्टम बनाते हैं।",
    missionTitle: "हमारा मिशन",
    mission: "हर भारतीय घर के लिए जल पुनर्चक्रण को सुलभ, किफायती और प्रभावी बनाना।",
    visionTitle: "हमारा विज़न",
    vision: "एक भविष्य जहां हर बूंद मायने रखती है, जहां ग्रे वाटर कभी बर्बाद नहीं होता।",
    valuesTitle: "हमें क्या प्रेरित करता है",
    innovators: "हमारे इनोवेटर्स",
    innovatorsSubtitle: "एक्वाएडाप्ट के नवाचार के पीछे के दिमाग",
    impact: "अब तक हमारा प्रभाव",
    impactSubtitle: "हर संख्या जल-सुरक्षित भविष्य की ओर एक कदम है",
    litersRecycled: "लीटर रीसायकल",
    happyHomes: "खुश घर",
    citiesServed: "शहर सेवित",
    satisfaction: "संतुष्टि दर",
  },
  contact: {
    title: "संपर्क करें",
    subtitle: "हम आपकी सभी जल फ़िल्ट्रेशन जरूरतों में मदद के लिए यहां हैं",
    call: "कॉल करें",
    whatsapp: "व्हाट्सएप",
    location: "स्थान",
    email: "ईमेल",
  },
  booking: {
    title: "अपना मुफ्त पानी टेस्ट बुक करें",
    subtitle: "हमारे प्रमाणित तकनीशियन आपके घर आएंगे और आपके पानी की गुणवत्ता का विश्लेषण करेंगे",
    selectSource: "पानी का स्रोत चुनें",
    chooseDateTime: "तारीख और समय चुनें",
    yourDetails: "आपका विवरण",
    confirm: "बुकिंग की पुष्टि करें",
    success: "बुकिंग की पुष्टि!",
  },
  common: {
    back: "वापस",
    continue: "जारी रखें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    loading: "लोड हो रहा है...",
    success: "सफल!",
    error: "त्रुटि",
    orderCartridge: "अपनी कारतूस ऑर्डर करें",
    newTest: "नया परीक्षण",
    paymentSuccess: "भुगतान सफल! आपकी कारतूस का आदेश की पुष्टि हो गई है। हमारी टीम जल्द ही सेटअप के लिए आपसे संपर्क करेगी।",
  },
};

// Tamil translations
const ta: Translations = {
  nav: {
    home: "முகப்பு",
    services: "சேவைகள்",
    homeTest: "வீட்டு சோதனை",
    bookTest: "சோதனை பதிவு",
    about: "எங்களை பற்றி",
    contact: "தொடர்பு",
    login: "உள்நுழை",
    dashboard: "டாஷ்போர்டு",
  },
  hero: {
    badge: "10,000+ வீடுகளால் நம்பப்படுகிறது",
    title1: "உங்கள்",
    title2: "சாம்பல் நீரை",
    title3: "தூய சேமிப்பாக மாற்றுங்கள்",
    subtitle: "உங்கள் வீட்டு சாம்பல் நீரை மறுசுழற்சி செய்யும் தனிப்பயன் வடிகட்டி அமைப்புகள். பணம் சேமியுங்கள், நீரை பாதுகாக்கவும்.",
    cta: "இலவச நீர் சோதனை பதிவு",
    explore: "எங்கள் சேவைகளை ஆராயுங்கள்",
    litersSaved: "லிட்டர் சேமிக்கப்பட்டது",
    happyHomes: "மகிழ்ச்சியான வீடுகள்",
    purityRate: "தூய்மை விகிதம்",
    costSavings: "செலவு சேமிப்பு",
  },
  homeTest: {
    title: "உங்கள் நீர் தரத்தை பகுப்பாய்வு செய்யுங்கள்",
    subtitle: "தனிப்பயன் வடிகட்டி பொருள் பரிந்துரைகளைப் பெற உங்கள் வீட்டு நீர் சோதனை முடிவுகளை உள்ளிடவும்",
    phLabel: "pH நிலை",
    phPlaceholder: "pH உள்ளிடவும் (0-14)",
    phIdeal: "சிறந்த வரம்பு: 6.5 - 8.5",
    tdsLabel: "TDS (மொத்த கரைந்த திடப்பொருட்கள்)",
    tdsPlaceholder: "ppm இல் TDS உள்ளிடவும்",
    tdsIdeal: "சிறந்தது: 500 ppm க்கும் குறைவாக",
    turbidity: "கலங்கல் (மேகமூட்டம்)",
    low: "குறைவு",
    medium: "நடுத்தரம்",
    high: "அதிகம்",
    hardness: "கடினத்தன்மை உள்ளதா?",
    hardnessHint: "(பாத்திரங்களில் படிவு/கறை)",
    softness: "மென்மை உள்ளதா?",
    softnessHint: "(வழுவழுப்பான உணர்வு, எளிதில் நுரை)",
    biological: "உயிரியல் மாசுபாடு?",
    biologicalHint: "(வாசனை, நிறம், சுவை பிரச்சனை)",
    yes: "ஆம்",
    no: "இல்லை",
    analyze: "நீரை பகுப்பாய்வு செய்",
    analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
    reset: "மீட்டமை",
    results: "பகுப்பாய்வு முடிவுகள்",
    ready: "பகுப்பாய்வுக்கு தயார்",
    readyDesc: "தனிப்பயன் வடிகட்டி பரிந்துரைகளைப் பெற உங்கள் நீர் சோதனை அளவுருக்களை நிரப்பவும்",
    recommendations: "பரிந்துரைக்கப்பட்ட வடிகட்டி பொருட்கள்",
    waterHyacinth: "ஆகாய தாமரை",
    bananaFiber: "வாழை நார்",
    activatedCarbon: "செயல்படுத்தப்பட்ட கரி",
    aluminaNanoBeads: "அலுமினா நானோ மணிகள்",
  },
  about: {
    title: "முன்னோடி நிலையான",
    subtitle: "நீர் தீர்வுகள்",
    ourStory: "எங்கள் கதை",
    storyTitle: "ஒரு எளிய கவனிப்பில் இருந்து பிறந்தது",
    story1: "2019 இல், இந்திய வீடுகளில் நீர் பயன்பாட்டை ஆராயும்போது, ஒவ்வொரு வீட்டிலும் தினமும் 100 லிட்டருக்கும் அதிகமான மறுபயன்படுத்தக்கூடிய சாம்பல் நீர் வீணாகிறது என்பதை கவனித்தோம்.",
    story2: "சமையலறை, துவைப்பு இயந்திரம் மற்றும் குளியலறையில் இருந்து வரும் இந்த நீர் தோட்டக்கலை, சுத்தம் மற்றும் ஃப்ளஷிங்கிற்கு எளிதாக மறுசுழற்சி செய்யலாம்.",
    story3: "இந்த இடைவெளியை நிரப்ப AquaAdapt உருவாக்கப்பட்டது. ஆகாய தாமரை போன்ற உள்ளூர் இயற்கை பொருட்களைப் பயன்படுத்தி, ஒவ்வொரு வீட்டின் தனித்துவமான நீர் தரத்திற்கு ஏற்ற தனிப்பயன் வடிகட்டுதல் அமைப்புகளை உருவாக்குகிறோம்.",
    missionTitle: "எங்கள் நோக்கம்",
    mission: "ஒவ்வொரு இந்திய வீட்டிற்கும் நீர் மறுசுழற்சியை அணுகக்கூடியதாகவும், மலிவானதாகவும், பயனுள்ளதாகவும் மாற்றுவது.",
    visionTitle: "எங்கள் தொலைநோக்கு",
    vision: "ஒவ்வொரு துளியும் முக்கியமான, சாம்பல் நீர் வீணாகாத ஒரு எதிர்காலம்.",
    valuesTitle: "எங்களை என்ன முன்னோக்கி இயக்குகிறது",
    innovators: "எங்கள் புதுமையாளர்கள்",
    innovatorsSubtitle: "AquaAdapt புதுமையின் பின்னால் உள்ள மூளைகள்",
    impact: "இதுவரை எங்கள் தாக்கம்",
    impactSubtitle: "ஒவ்வொரு எண்ணும் நீர்-பாதுகாப்பான எதிர்காலத்தை நோக்கிய ஒரு படி",
    litersRecycled: "லிட்டர் மறுசுழற்சி",
    happyHomes: "மகிழ்ச்சியான வீடுகள்",
    citiesServed: "நகரங்கள் சேவை",
    satisfaction: "திருப்தி விகிதம்",
  },
  contact: {
    title: "தொடர்பு கொள்ளுங்கள்",
    subtitle: "உங்கள் அனைத்து நீர் வடிகட்டுதல் தேவைகளுக்கும் உதவ நாங்கள் இங்கே இருக்கிறோம்",
    call: "அழைக்கவும்",
    whatsapp: "வாட்ஸ்அப்",
    location: "இடம்",
    email: "மின்னஞ்சல்",
  },
  booking: {
    title: "உங்கள் இலவச நீர் சோதனையை பதிவு செய்யுங்கள்",
    subtitle: "எங்கள் சான்றளிக்கப்பட்ட தொழில்நுட்ப வல்லுநர் உங்கள் வீட்டிற்கு வந்து உங்கள் நீர் தரத்தை பகுப்பாய்வு செய்வார்",
    selectSource: "நீர் மூலத்தை தேர்வு செய்யவும்",
    chooseDateTime: "தேதி & நேரத்தை தேர்வு செய்யவும்",
    yourDetails: "உங்கள் விவரங்கள்",
    confirm: "பதிவை உறுதிப்படுத்தவும்",
    success: "பதிவு உறுதிப்படுத்தப்பட்டது!",
  },
  common: {
    back: "பின்",
    continue: "தொடர்",
    submit: "சமர்ப்பி",
    cancel: "ரத்து",
    loading: "ஏற்றுகிறது...",
    success: "வெற்றி!",
    error: "பிழை",
    orderCartridge: "உங்கள் கார்ட்ரிட்ஜை ஆர்டர் செய்யவும்",
    newTest: "புதிய சோதனை",
    paymentSuccess: "பணம் செலுத்துவது வெற்றிகரமாகும்! உங்கள் கார்ட்ரிட்ஜ் ஆர்டர் உறுதிப்படுத்தப்பட்டுள்ளது. எங்கள் குழு விரைவில் அமைப்பிற்காக உங்களைத் தொடர்புகொள்ளும்।",
  },
};

// Malayalam translations
const ma: Translations = {
  nav: {
    home: "ഹോം",
    services: "സേവനങ്ങൾ",
    homeTest: "വീട്ടിലെ പരിശോധന",
    bookTest: "പരിശോധന ബുക്ക് ചെയ്യുക",
    about: "ഞങ്ങളെ കുറിച്ച്",
    contact: "ഞങ്ങളെ ബന്ധപ്പെടുക",
    login: "പ്രവേശിക്കുക",
    dashboard: "ഡാഷ്ബോർഡ്",
  },
  hero: {
    badge: "10,000+ വീടുകൾ വിശ്വാസ ചെയ്യുന്നു",
    title1: "നിങ്ങളുടെ",
    title2: "ധൂസരജലം",
    title3: "ശുദ്ധ സാഷ്ടായിക്കയായി പരിവർത്തനം ചെയ്യുക",
    subtitle: "നിങ്ങളുടെ വീട്ടിലെ ധൂസരജലം പുനരുപയോഗം ചെയ്യുന്ന പരിസ്ഥിതി സൗഹൃദ ഫിൽട്രേഷൻ സിസ്റ്റം. പണം സമ്പാദിക്കുക, വെള്ളം സംരക്ഷിക്കുക.",
    cta: "സ്വതന്ത്ര ജല പരിശോധന ബുക്ക് ചെയ്യുക",
    explore: "ഞങ്ങളുടെ സേവനങ്ങൾ കണ്ടെത്തുക",
    litersSaved: "ലിറ്റർ സംരക്ഷിക്കപ്പെട്ടു",
    happyHomes: "സന്തുഷ്ട വീടുകൾ",
    purityRate: "ശുദ്ധതയുടെ നിരക്ക്",
    costSavings: "ചെലവ് സാഷ്ടായിക്കം",
  },
  homeTest: {
    title: "നിങ്ങളുടെ ജലത്തിന്റെ ഗുണനിലവാരം വിശകലനം ചെയ്യുക",
    subtitle: "ഇഷ്ടാനുസൃത ഫിൽട്ടർ വസ്തു ശുപാരിശകൾ ലഭിക്കാൻ നിങ്ങളുടെ വീട്ടിലെ ജല പരിശോധന ഫലങ്ങൾ നൽകുക",
    phLabel: "pH നിലവാരം",
    phPlaceholder: "pH നൽകുക (0-14)",
    phIdeal: "അനുയോജ്യ പരിധി: 6.5 - 8.5",
    tdsLabel: "TDS (മൊത്തം കരിഞ്ഞ കണിക)",
    tdsPlaceholder: "TDS ppm ൽ നൽകുക",
    tdsIdeal: "അനുയോജ്യ: 500 ppm ൌന്നിൽ കുറവ്",
    turbidity: "അസ്വച്ഛതയ് (മേഘലതയ്)",
    low: "കുറഞ്ഞ്",
    medium: "മധ്യമ",
    high: "ഉയർന്ന്",
    hardness: "കാഠിന്യം ഉണ്ടോ?",
    hardnessHint: "(പാത്രങ്ങളിലെ നിക്ഷേപം/സ്കേൽ)",
    softness: "മൃദുത്വം ഉണ്ടോ?",
    softnessHint: "(സ്ലിപ്പറി അനുഭൂതി, എളുപ്പത്തിൽ നുരയ്)",
    biological: "ജൈവ മലിനീകരണം?",
    biologicalHint: "(запаһ, നിറം, രുചി സമസ്യ)",
    yes: "അതെ",
    no: "ഇല്ല",
    analyze: "ജലം വിശകലനം ചെയ്യുക",
    analyzing: "വിശകലനം നടക്കുകയാണ്...",
    reset: "പുനഃസജ്ജമാക്കുക",
    results: "വിശകലന ഫലങ്ങൾ",
    ready: "വിശകലനത്തിന് തയ്യാരാണ്",
    readyDesc: "ഇഷ്ടാനുസൃത ഫിൽട്ടർ ശുപാരിശകൾ ലഭിക്കാൻ നിങ്ങളുടെ ജല പരിശോധന പരാമീറ്ററുകൾ പൂരിപ്പിക്കുക",
    recommendations: "ശുപാരിശ ചെയ്ത ഫിൽട്ടർ വസ്തുക്കൾ",
    waterHyacinth: "വെള്ളപ്പുഷ്പം",
    bananaFiber: "വാഴതന്തുവ",
    activatedCarbon: "സജ്ജീകൃത കാർബൺ",
    aluminaNanoBeads: "അലുമിന നാനോ മണികൾ",
  },
  about: {
    title: "പ്രധാന സതപോഷക",
    subtitle: "ജല പരിഹാരങ്ങൾ",
    ourStory: "ഞങ്ങളുടെ കഥ",
    storyTitle: "ഒരു സാധാരണ നിരീക്ഷണത്തിൽ നിന്ന് ജനിച്ചത്",
    story1: "2019 ൽ, ഇന്ത്യൻ വീടുകളിലെ ജല ഉപയോഗം ഗവേഷണം ചെയ്യുന്നതിനിടയിൽ, ഓരോ വീട്ടിലും പ്രതിദിനം 100 ലിറ്ററിൽ കൂടുതലുള്ള പുനരുപയോഗയോഗ്യ ധൂസരജലം നഷ്ടപ്പെടുന്നു എന്നത് ഞങ്ങൾ ശ്രദ്ധിച്ചു.",
    story2: "അടുക്കളയിൽ നിന്ന്, വാഷിംഗ് മെഷീനിൽ നിന്നും ഷവരിൽ നിന്നും വരുന്ന ഈ ജലം പ്രസാദനത്തിനും സ്ഥാനം പരിഷ്കരണത്തിനും പുനരുപയോഗിക്കാൻ എളുപ്പത്തിൽ കഴിയും.",
    story3: "ഈ വിടവ് നിഷ്പാദിക്കാൻ AquaAdapt സൃഷ്ടിക്കപ്പെട്ടു. വെള്ളപ്പുഷ്പം പോലെയുള്ള പ്രാദേശിക പ്രകൃതിമാത്ര ഉപയോഗിച്ച്, ഓരോ വീട്ടിന്റെ തനത് ജല ഗുണനിലവാരത്തിന് അനുരൂപമായ ഇഷ്ടാനുസൃത ഫിൽട്രേഷൻ സിസ്റ്റം നിർമ്മിക്കുന്നു.",
    missionTitle: "ഞങ്ങളുടെ ലക്ഷ്യം",
    mission: "ഓരോ ഇന്ത്യൻ വീട്ടിനും ജല പുനരുപയോഗം പ്രാപ്യവും സാധ്യവും കാര്യকരവും ആക്കുക.",
    visionTitle: "ഞങ്ങളുടെ ദൃഷ്ടിപഥം",
    vision: "ഓരോ തുള്ളിയും പ്രത്യേകത, ധൂസരജലം നഷ്ടപ്പെടാത്ത ഒരു ഭവിഷ്യത്ത്.",
    valuesTitle: "എന്താണ് ഞങ്ങളെ മുന്നോട്ട് നയിക്കുന്നത്",
    innovators: "ഞങ്ങളുടെ ആവിഷ്കാരകർ",
    innovatorsSubtitle: "AquaAdapt പാരിപുരസ്തിനയ്ക്ക് പിന്നിലെ മനസുകൾ",
    impact: "ഞങ്ങളുടെ സ്വാധീനം ഇതുവരെ",
    impactSubtitle: "ഓരോ സംഖ്യയും ജല സംരക്ഷണ ഭവിഷ്യത്തിലേക്കുള്ള ഒരു പടി",
    litersRecycled: "ലിറ്റർ പുനരുപയോഗിക്കപ്പെട്ടു",
    happyHomes: "സന്തുഷ്ട വീടുകൾ",
    citiesServed: "നഗരങ്ങൾ സേവിതം",
    satisfaction: "സന്തുഷ്ടി നിരക്ക്",
  },
  contact: {
    title: "ഞങ്ങളെ ബന്ധപ്പെടുക",
    subtitle: "നിങ്ങളുടെ എല്ലാ ജല ഫിൽട്രേഷൻ ആവശ്യത്തിന് സഹായം നൽകാൻ ഞങ്ങൾ ഇവിടെയുണ്ട്",
    call: "വിളിക്കുക",
    whatsapp: "വാട്സാപ്",
    location: "സ്ഥാനം",
    email: "ഇമെയിൽ",
  },
  booking: {
    title: "നിങ്ങളുടെ സ്വതന്ത്ര ജല പരിശോധന ബുക്ക് ചെയ്യുക",
    subtitle: "ഞങ്ങളുടെ സർട്ടിഫൈഡ് സാങ്കേതിക വിദ്വാൻ നിങ്ങളുടെ വീട്ടിൽ വന്ന് നിങ്ങളുടെ ജല ഗുണനിലവാരം വിശകലനം ചെയ്യും",
    selectSource: "ജല സ്രോതസ് തിരഞ്ഞെടുക്കുക",
    chooseDateTime: "തീയതി & സമയം തിരഞ്ഞെടുക്കുക",
    yourDetails: "നിങ്ങളുടെ വിവരങ്ങൾ",
    confirm: "ബുക്കിംഗ് സ്ഥിരീകരിക്കുക",
    success: "ബുക്കിംഗ് സ്ഥിരീകരിക്കപ്പെട്ടു!",
  },
  common: {
    back: "പിന്നിലേക്ക്",
    continue: "തുടരുക",
    submit: "സമർപ്പിക്കുക",
    cancel: "റദ്ദ് ചെയ്യുക",
    loading: "ലോഡ് ചെയ്യുകയാണ്...",
    success: "വിജയം!",
    error: "പിശക്",
    orderCartridge: "നിങ്ങളുടെ കാർട്രിഡ്ജ് ഓർഡർ ചെയ്യുക",
    newTest: "പുതിയ പരീക്ഷ",
    paymentSuccess: "പേയ്‌മെന്റ് വിജയിച്ചു! നിങ്ങളുടെ കാർട്രിഡ്ജ് ഓർഡർ സ്ഥിരീകരിച്ചു. സെറ്റപ്പിനായി ഞങ്ങളുടെ ടീം വിദൂരെ നിന്ന് നിങ്ങളെ ബന്ധപ്പെടും।",
  },
};

// All translations
const translations: Record<Language, Translations> = { en, hi, ta, ma };

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("language") as Language;
    return saved && translations[saved] ? saved : "en";
  });

  // Save language preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Get translations for current language
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
