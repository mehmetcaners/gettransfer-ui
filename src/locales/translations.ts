import type { VehicleType } from '../lib/price';

export type LanguageCode = 'tr' | 'en' | 'de' | 'fr' | 'it' | 'ar';
export type NavKey = 'transfer' | 'tours' | 'about' | 'contact' | 'reservation';
export type TabKey = 'transfer' | 'hourly' | 'tours';

export type TranslationContent = {
  header: {
    nav: Record<NavKey, string>;
    languageMenuTitle: string;
  };
  reservationBar: {
    tabs: Record<TabKey, string>;
    placeholders: {
      from: string;
      to: string;
      datetime: string;
      returnDatetime: string;
    };
    passengersOptionSuffix: string;
    swapAria: string;
    searchAria: string;
    searchButton: string;
    roundTrip: string;
    comingSoon: string;
  };
  home: {
    heroTitle: string;
    heroDescription: string;
    cities: readonly string[];
    advantagesTitle: string;
    advantages: {
      icon: 'plane' | 'clock' | 'shield' | 'car';
      title: string;
      description: string;
    }[];
    citiesTitle: string;
    citiesDescription: string;
    faqTitle: string;
    faq: {
      question: string;
      answer: string;
    }[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  results: {
    backButton: string;
    searchDetailsTitle: string;
    labels: {
      from: string;
      to: string;
      datetime: string;
      passengers: string;
      return: string;
      distance: string;
    };
    passengersSuffix: string;
    availableVehiclesTitle: string;
    cashWarning: string;
  };
  vehicles: {
    cards: {
      type: VehicleType;
      name: string;
      features: string[];
      capacity: {
        passengers: number;
        luggage: number;
      };
    }[];
    passengersLabel: string;
    luggageLabel: string;
    estimatedPrice: string;
    selectButton: string;
  };
  booking: {
    backButton: string;
    title: string;
    contactTitle: string;
    fields: {
      firstName: string;
      firstNamePlaceholder: string;
      lastName: string;
      lastNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      notes: string;
      notesPlaceholder: string;
    };
    errors: {
      firstNameRequired: string;
      lastNameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
    };
    submit: string;
    submitting: string;
    summaryTitle: string;
    summary: {
      route: string;
      datetime: string;
      return: string;
      passengers: string;
      passengersSuffix: string;
      vehicle: string;
      estimatedPrice: string;
      cashNote: string;
    };
    alerts: {
      genericError: string;
    };
  };
  confirm: {
    title: string;
    description: string;
    cashTitle: string;
    cashMessage: string;
    contactTitle: string;
    contactMessage: string;
    newSearch: string;
    home: string;
    referenceLabel?: string;
  };
  contact: {
    title: string;
    description: string;
    contactInfoTitle: string;
    phoneTitle: string;
    emailTitle: string;
    addressTitle: string;
    hoursTitle: string;
    hoursDescription: string;
    socialTitle: string;
    whatsappAria: string;
    instagramAria: string;
    tripadvisorAria: string;
    formTitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
    };
    mapTitle: string;
  };
  about: {
    badge: string;
    title: string;
    description: string;
    stats: {
      label: string;
      value: string;
      detail: string;
    }[];
    missionTitle: string;
    missionParagraphs: string[];
    missionChecklist: string[];
    imageTags: string[];
    whyTitle: string;
    whyDescription: string;
    whyItems: {
      title: string;
      description: string;
    }[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  notFound: {
    title: string;
    description: string;
    home: string;
    search: string;
  };
  footer: {
    description: string;
    contactTitle: string;
    quickLinksTitle: string;
    links: {
      about: string;
      contact: string;
      faq: string;
    };
    rights: (year: number, company: string) => string;
    cashWarning: string;
  };
  general: {
    cashOnly: string;
    whatsappAria: string;
  };
};

type LanguageDescriptor = {
  meta: {
    label: string;
    name: string;
    flag: string;
    locale: string;
    direction: 'ltr' | 'rtl';
  };
  dictionary: TranslationContent;
};

const cities = [
  'İstanbul',
  'Antalya',
  'Bodrum',
  'Dalaman',
  'İzmir',
  'Trabzon',
  'Nevşehir',
  'Kayseri',
  'Gaziantep',
  'Adana',
] as const;

export const translations: Record<LanguageCode, LanguageDescriptor> = {
  tr: {
    meta: {
      label: 'TR',
      name: 'Türkçe',
      flag: 'https://flagcdn.com/w40/tr.png',
      locale: 'tr-TR',
      direction: 'ltr',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'Transfer',
          tours: 'Turlar',
          about: 'Hakkımızda',
          contact: 'İletişim',
          reservation: 'Rezervasyon',
        },
        languageMenuTitle: 'Dil Seçimi',
      },
      reservationBar: {
        tabs: {
          transfer: 'Transfer',
          hourly: 'Saatlik Kirala',
          tours: 'Turlar',
        },
        placeholders: {
          from: 'Nereden (Havalimanı, Otel...)',
          to: 'Nereye',
          datetime: 'Tarih ve Saat',
          returnDatetime: 'Dönüş Tarih ve Saat',
        },
        passengersOptionSuffix: 'Kişi',
        swapAria: 'Yerleri değiştir',
        searchAria: 'Araç ara',
        searchButton: 'Ara',
        roundTrip: 'Gidiş-Dönüş',
        comingSoon: 'Bu özellik yakında eklenecektir.',
      },
      home: {
        heroTitle: 'Havalimanlarında yanınızdayız.',
        heroDescription:
          'İstanbul, Antalya, Bodrum, Dalaman, İzmir, Trabzon ve daha birçok şehirde güvenilir transfer hizmeti.',
        cities,
        advantagesTitle: 'Neden GetTransfer İstanbul?',
        advantages: [
          {
            icon: 'plane',
            title: 'Zamanında Karşılama',
            description: 'Uçuş takip sistemiyle her zaman zamanında havalimanında oluyoruz.',
          },
          {
            icon: 'clock',
            title: '7/24 Hizmet',
            description: 'Gece gündüz demeden size hizmet vermeye hazırız.',
          },
          {
            icon: 'shield',
            title: 'Güvenli Seyahat',
            description:
              'Profesyonel sürücülerimiz ve sigortalı araçlarımızla güvende hissedin.',
          },
          {
            icon: 'car',
            title: 'VIP Araçlar',
            description:
              "Ekonomiden VIP'e kadar geniş araç seçenekleriyle konfora önem veriyoruz.",
          },
        ],
        citiesTitle: 'Hizmet Verdiğimiz Şehirler',
        citiesDescription: "Türkiye'nin önde gelen havalimanlarında transfer hizmeti sunuyoruz",
        faqTitle: 'Sıkça Sorulan Sorular',
        faq: [
          {
            question: 'Ödeme nasıl yapılır?',
            answer:
              'Ödeme yalnızca nakit olarak sürücüye veya ofisimizde yapılabilir. Kredi kartı kabul edilmemektedir.',
          },
          {
            question: 'Uçuş gecikmelerinde ne olur?',
            answer:
              'Uçuş takip sistemimiz sayesinde gecikmelerinizi otomatik olarak tespit eder ve sürücümüz sizi bekler. Ek ücret alınmaz.',
          },
          {
            question: 'İptal politikanız nedir?',
            answer:
              'Transfer saatinden 24 saat öncesine kadar ücretsiz iptal edebilirsiniz. Daha geç iptallerde ücret politikamız değişkenlik gösterebilir.',
          },
          {
            question: 'Bagaj limiti var mı?',
            answer:
              'Her araç tipinin bagaj kapasitesi farklıdır. Rezervasyon sırasında seçtiğiniz araç için belirtilen bagaj limitini görebilirsiniz.',
          },
          {
            question: 'Çocuk koltuğu sağlanır mı?',
            answer:
              'Evet, rezervasyon notlarınızda belirtmeniz durumunda ücretsiz olarak çocuk koltuğu sağlıyoruz.',
          },
        ],
        ctaTitle: 'Hemen Rezervasyon Yapın',
        ctaDescription:
          'Havalimanı transferinizi şimdi planlayın, rahat bir yolculuğun keyfini çıkarın.',
        ctaButton: 'Rezervasyon Yap',
      },
      results: {
        backButton: 'Aramaya Dön',
        searchDetailsTitle: 'Arama Detayları',
        labels: {
          from: 'Nereden',
          to: 'Nereye',
          datetime: 'Tarih & Saat',
          passengers: 'Kişi Sayısı',
          return: 'Dönüş',
          distance: 'Mesafe',
        },
        passengersSuffix: 'Kişi',
        availableVehiclesTitle: 'Uygun Araçlar',
        cashWarning: '⚠️ Ödeme yalnızca nakit olarak yapılır. Kredi kartı alınmaz.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'Ekonomi Sedan',
            capacity: { passengers: 3, luggage: 2 },
            features: ['Klimalı', 'Rahat koltuklar', 'Deneyimli sürücü', 'Ücretsiz iptal (24 saat)'],
          },
          {
            type: 'minivan',
            name: 'Minivan',
            capacity: { passengers: 6, luggage: 4 },
            features: ['Geniş iç alan', 'Klimalı', 'USB şarj', 'Ücretsiz iptal (24 saat)'],
          },
          {
            type: 'vip-vito',
            name: 'VIP Mercedes Vito',
            capacity: { passengers: 6, luggage: 6 },
            features: ['Premium deri koltuklar', 'Wi-Fi', 'Su ikramı', 'VIP sürücü', 'Ücretsiz iptal (48 saat)'],
          },
          {
            type: 'minibus',
            name: 'Minibüs',
            capacity: { passengers: 14, luggage: 10 },
            features: ['Grup transferi', 'Geniş bagaj alanı', 'Klimalı', 'Ücretsiz iptal (24 saat)'],
          },
          {
            type: 'bus',
            name: 'Otobüs',
            capacity: { passengers: 30, luggage: 30 },
            features: ['Büyük grup transferi', 'Konforlu koltuklar', 'Klimalı', 'Profesyonel sürücü'],
          },
        ],
        passengersLabel: 'Kişi',
        luggageLabel: 'Valiz',
        estimatedPrice: 'Tahmini fiyat',
        selectButton: 'Seç',
      },
      booking: {
        backButton: 'Araç Seçimine Dön',
        title: 'Rezervasyon Bilgileri',
        contactTitle: 'İletişim Bilgileri',
        fields: {
          firstName: 'Ad',
          firstNamePlaceholder: 'Adınız',
          lastName: 'Soyad',
          lastNamePlaceholder: 'Soyadınız',
          email: 'E-posta',
          emailPlaceholder: 'ornek@email.com',
          phone: 'Telefon',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'Rezervasyon Notu (Opsiyonel)',
          notesPlaceholder: 'Örn: Çocuk koltuğu gerekli, ekstra bagaj var...',
        },
        errors: {
          firstNameRequired: 'Ad gereklidir',
          lastNameRequired: 'Soyad gereklidir',
          emailRequired: 'E-posta gereklidir',
          emailInvalid: 'Geçerli bir e-posta adresi giriniz',
          phoneRequired: 'Telefon numarası gereklidir',
          phoneInvalid: 'Geçerli bir telefon numarası giriniz',
        },
        submit: 'Rezervasyonu Tamamla (Nakit Ödeme)',
        submitting: 'İşleniyor...',
        summaryTitle: 'Rezervasyon Özeti',
        summary: {
          route: 'Güzergah',
          datetime: 'Tarih & Saat',
          return: 'Dönüş',
          passengers: 'Kişi Sayısı',
          passengersSuffix: 'Kişi',
          vehicle: 'Araç',
          estimatedPrice: 'Tahmini Fiyat',
          cashNote: '💵 Ödeme nakit olarak sürücüye yapılacaktır.',
        },
        alerts: {
          genericError: 'Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        },
      },
      confirm: {
        title: 'Rezervasyonunuz Alındı!',
        description:
          'Rezervasyon talebiniz başarıyla kaydedildi. Sürücümüz en kısa sürede sizi arayarak detayları teyit edecektir.',
        cashTitle: '💵 Ödeme Bilgisi',
        cashMessage: 'Ödeme yalnızca nakit olarak sürücüye veya ofisimizde yapılır. Kredi kartı kabul edilmemektedir.',
        contactTitle: '📞 İletişim',
        contactMessage:
          'Sorularınız için bize WhatsApp üzerinden ulaşabilir veya sağ alttaki butonu kullanarak mesaj gönderebilirsiniz.',
        newSearch: 'Yeni Arama',
        home: 'Anasayfa',
        referenceLabel: 'Rezervasyon Numarası',
      },
      contact: {
        title: 'İletişim',
        description: 'Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.',
        contactInfoTitle: 'İletişim Bilgileri',
        phoneTitle: 'Telefon',
        emailTitle: 'E-posta',
        addressTitle: 'Adres',
        hoursTitle: 'Çalışma Saatleri',
        hoursDescription: '7/24 Hizmet Veriyoruz',
        socialTitle: 'Sosyal Medya',
        whatsappAria: 'WhatsApp',
        instagramAria: 'Instagram',
        tripadvisorAria: 'Tripadvisor',
        formTitle: 'Mesaj Gönderin',
        form: {
          nameLabel: 'Ad Soyad',
          namePlaceholder: 'Adınız ve soyadınız',
          emailLabel: 'E-posta',
          emailPlaceholder: 'ornek@email.com',
          messageLabel: 'Mesajınız',
          messagePlaceholder: 'Mesajınızı buraya yazın...',
          submit: 'Gönder',
        },
        mapTitle: 'GetTransfer İstanbul Ofis',
      },
      about: {
        badge: 'HAKKIMIZDA',
        title: 'İstanbul Havalimanı Transferinde 20 Yıllık Güven',
        description:
          'Yurtdışından gelen misafirlerimizi İstanbul Havalimanı ve Sabiha Gökçen’de karşılıyor, otel transferi, şehir içi ulaşım ve Türkiye turu hizmetlerinde konforlu, güvenli ve zamanında yolculuk deneyimi sunuyoruz.',
        stats: [
          {
            label: 'Yıllık Tecrübe',
            value: '20+',
            detail: 'İstanbul Havalimanı ve Sabiha Gökçen transferlerinde güçlü saha deneyimi.',
          },
          {
            label: 'Başarılı Transfer',
            value: '25.000+',
            detail: 'Havalimanı, otel ve şehir içi ulaşım operasyonlarında tamamlanan yolculuklar.',
          },
          {
            label: 'Mutlu Misafir',
            value: '10.000+',
            detail: 'Yurtdışından gelen misafirler için güven veren ve planlı ulaşım deneyimi.',
          },
          {
            label: 'Havalimanı Karşılama',
            value: '7/24',
            detail: 'Uçuş saatine göre planlanan, günün her anında aktif karşılama desteği.',
          },
        ],
        missionTitle: 'Misyonumuz',
        missionParagraphs: [
          'Misyonumuz, İstanbul’a gelen her misafirimize havalimanından itibaren güvenli, konforlu ve sorunsuz bir ulaşım deneyimi sunmaktır. 20 yıllık saha tecrübemizle; uçuş takibi, zamanında karşılama, profesyonel sürücü desteği ve modern araç filomuzla misafirlerimizin yolculuğunu kolaylaştırıyoruz.',
          'Sadece transfer değil; otel ulaşımı, şehir içi özel şoförlü hizmetler ve Türkiye turu planlarında da misafirlerimize güvenilir bir yol arkadaşı olmayı hedefliyoruz.',
        ],
        missionChecklist: [
          'Havalimanında karşılama',
          'Otel ve şehir içi transfer',
          'Türkiye turu ve özel rota desteği',
          'Profesyonel sürücü ve konforlu araç',
        ],
        imageTags: [
          'İstanbul Havalimanı',
          'Sabiha Gökçen',
          'Otel Transferi',
          'Şehir İçi Ulaşım',
        ],
        whyTitle: 'Neden Bizi Seçmelisiniz?',
        whyDescription:
          'İstanbul’a gelen misafirler için havalimanı karşılamadan otel ulaşımına kadar planlı, şeffaf ve güven veren bir transfer operasyonu sunuyoruz.',
        whyItems: [
          {
            title: '20 Yıllık Havalimanı Deneyimi',
            description:
              'İstanbul Havalimanı ve Sabiha Gökçen transferlerinde yıllardır edindiğimiz saha deneyimiyle misafirlerimizi doğru zamanda, doğru noktadan karşılıyoruz.',
          },
          {
            title: 'Yurtdışı Misafir Karşılama',
            description:
              'İstanbul’a ilk kez gelen misafirler için anlaşılır iletişim, kolay buluşma noktası ve güven veren karşılama süreci sunuyoruz.',
          },
          {
            title: 'Otel, Transfer ve Tur Hizmetleri',
            description:
              'Havalimanı-otel transferlerinin yanında şehir içi ulaşım, özel rota ve Türkiye turu ihtiyaçlarında da destek sağlıyoruz.',
          },
          {
            title: 'Şeffaf ve Güvenilir Hizmet',
            description:
              'Rezervasyon öncesi net bilgilendirme, zamanında hizmet ve sürpriz maliyet oluşturmayan fiyat politikasıyla güvenilir bir yolculuk sunuyoruz.',
          },
        ],
        ctaTitle: 'İstanbul’a İndiğiniz Andan İtibaren Güvenli Ulaşım',
        ctaDescription:
          'İstanbul Havalimanı, Sabiha Gökçen, otel transferleri, şehir içi ulaşım ve Türkiye turu planları için rezervasyonunuzu birkaç adımda oluşturun.',
        ctaButton: 'Transfer Planla',
      },
      notFound: {
        title: 'Sayfa Bulunamadı',
        description: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.',
        home: 'Anasayfa',
        search: 'Araç Ara',
      },
      footer: {
        description: 'İstanbul havalimanlarından güvenilir ve konforlu transfer hizmeti.',
        contactTitle: 'İletişim',
        quickLinksTitle: 'Hızlı Bağlantılar',
        links: {
          about: 'Hakkımızda',
          contact: 'İletişim',
          faq: 'Sıkça Sorulan Sorular',
        },
        rights: (year, company) => `© ${year} ${company}. Tüm hakları saklıdır.`,
        cashWarning: 'Ödeme yalnızca nakit olarak yapılır. Kredi kartı alınmaz.',
      },
      general: {
        cashOnly: 'Ödeme yalnızca nakit olarak yapılır. Kredi kartı alınmaz.',
        whatsappAria: 'WhatsApp ile iletişim',
      },
    },
  },
  en: {
    meta: {
      label: 'EN',
      name: 'English',
      flag: 'https://flagcdn.com/w40/gb.png',
      locale: 'en-GB',
      direction: 'ltr',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'Transfer',
          tours: 'Tours',
          about: 'About Us',
          contact: 'Contact',
          reservation: 'Reservation',
        },
        languageMenuTitle: 'Language',
      },
      reservationBar: {
        tabs: {
          transfer: 'Transfer',
          hourly: 'Hourly Rental',
          tours: 'Tours',
        },
        placeholders: {
          from: 'From (Airport, Hotel...)',
          to: 'To',
          datetime: 'Date & Time',
          returnDatetime: 'Return Date & Time',
        },
        passengersOptionSuffix: 'Passenger(s)',
        swapAria: 'Swap locations',
        searchAria: 'Search vehicle',
        searchButton: 'Search',
        roundTrip: 'Return Trip',
        comingSoon: 'This feature will be added soon.',
      },
      home: {
        heroTitle: 'We are by your side at the airports.',
        heroDescription:
          'Reliable transfer service in Istanbul, Antalya, Bodrum, Dalaman, Izmir, Trabzon and many more cities.',
        cities,
        advantagesTitle: 'Why GetTransfer Istanbul?',
        advantages: [
          {
            icon: 'plane',
            title: 'On-Time Pickup',
            description: 'We track flights and always arrive at the airport on time.',
          },
          {
            icon: 'clock',
            title: '24/7 Service',
            description: 'We are ready to serve you day and night.',
          },
          {
            icon: 'shield',
            title: 'Safe Travel',
            description: 'Feel secure with our professional drivers and insured vehicles.',
          },
          {
            icon: 'car',
            title: 'VIP Vehicles',
            description: 'We care about comfort with a wide range from economy to VIP.',
          },
        ],
        citiesTitle: 'Cities We Serve',
        citiesDescription: "We provide transfer service at Turkey's leading airports",
        faqTitle: 'Frequently Asked Questions',
        faq: [
          {
            question: 'How is the payment made?',
            answer:
              'Payment can only be made in cash to the driver or at our office. Credit cards are not accepted.',
          },
          {
            question: 'What happens if the flight is delayed?',
            answer:
              'With our flight tracking system, we detect delays automatically and our driver waits for you. No extra fee is charged.',
          },
          {
            question: 'What is your cancellation policy?',
            answer:
              'You can cancel free of charge up to 24 hours before the transfer time. Later cancellations may be subject to additional fees.',
          },
          {
            question: 'Is there a luggage limit?',
            answer:
              'Each vehicle type has a different luggage capacity. You can see the limit during reservation according to the vehicle you choose.',
          },
          {
            question: 'Do you provide child seats?',
            answer:
              'Yes, if you mention it in your booking notes, we provide a child seat free of charge.',
          },
        ],
        ctaTitle: 'Book Now',
        ctaDescription: 'Plan your airport transfer now and enjoy a comfortable journey.',
        ctaButton: 'Book a Transfer',
      },
      results: {
        backButton: 'Back to Search',
        searchDetailsTitle: 'Search Details',
        labels: {
          from: 'From',
          to: 'To',
          datetime: 'Date & Time',
          passengers: 'Passengers',
          return: 'Return',
          distance: 'Distance',
        },
        passengersSuffix: 'Passengers',
        availableVehiclesTitle: 'Available Vehicles',
        cashWarning: '⚠️ Payment is cash only. Cards are not accepted.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'Economy Sedan',
            capacity: { passengers: 3, luggage: 2 },
            features: ['Air-conditioned', 'Comfortable seats', 'Experienced driver', 'Free cancellation (24h)'],
          },
          {
            type: 'minivan',
            name: 'Minivan',
            capacity: { passengers: 6, luggage: 4 },
            features: ['Spacious interior', 'Air-conditioned', 'USB charging', 'Free cancellation (24h)'],
          },
          {
            type: 'vip-vito',
            name: 'VIP Mercedes Vito',
            capacity: { passengers: 6, luggage: 6 },
            features: ['Premium leather seats', 'Wi-Fi', 'Complimentary water', 'VIP driver', 'Free cancellation (48h)'],
          },
          {
            type: 'minibus',
            name: 'Minibus',
            capacity: { passengers: 14, luggage: 10 },
            features: ['Group transfers', 'Large luggage space', 'Air-conditioned', 'Free cancellation (24h)'],
          },
          {
            type: 'bus',
            name: 'Coach',
            capacity: { passengers: 30, luggage: 30 },
            features: ['Large group transfers', 'Comfortable seats', 'Air-conditioned', 'Professional driver'],
          },
        ],
        passengersLabel: 'Passengers',
        luggageLabel: 'Bags',
        estimatedPrice: 'Estimated price',
        selectButton: 'Select',
      },
      booking: {
        backButton: 'Back to Vehicle Selection',
        title: 'Booking Details',
        contactTitle: 'Contact Information',
        fields: {
          firstName: 'First Name',
          firstNamePlaceholder: 'Your first name',
          lastName: 'Last Name',
          lastNamePlaceholder: 'Your last name',
          email: 'Email',
          emailPlaceholder: 'example@email.com',
          phone: 'Phone',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'Booking Note (Optional)',
          notesPlaceholder: 'e.g. Need child seat, extra luggage...',
        },
        errors: {
          firstNameRequired: 'First name is required',
          lastNameRequired: 'Last name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Please enter a valid email address',
          phoneRequired: 'Phone number is required',
          phoneInvalid: 'Please enter a valid phone number',
        },
        submit: 'Complete Booking (Cash Payment)',
        submitting: 'Processing...',
        summaryTitle: 'Booking Summary',
        summary: {
          route: 'Route',
          datetime: 'Date & Time',
          return: 'Return',
          passengers: 'Passengers',
          passengersSuffix: 'Passengers',
          vehicle: 'Vehicle',
          estimatedPrice: 'Estimated Price',
          cashNote: '💵 Payment will be made in cash to the driver.',
        },
        alerts: {
          genericError: 'An error occurred while creating the booking. Please try again.',
        },
      },
      confirm: {
        title: 'Your Booking Has Been Received!',
        description:
          'Your request has been saved successfully. Our driver will contact you shortly to confirm the details.',
        cashTitle: '💵 Payment Information',
        cashMessage: 'Payments are made in cash to the driver or at our office. Credit cards are not accepted.',
        contactTitle: '📞 Contact',
        contactMessage:
          'If you have any questions, reach us on WhatsApp or use the button at the bottom right to send a message.',
        newSearch: 'New Search',
        home: 'Home',
        referenceLabel: 'Reservation Number',
      },
      contact: {
        title: 'Contact',
        description: 'Get in touch with us for any questions. We are happy to help.',
        contactInfoTitle: 'Contact Information',
        phoneTitle: 'Phone',
        emailTitle: 'Email',
        addressTitle: 'Address',
        hoursTitle: 'Working Hours',
        hoursDescription: 'We operate 24/7',
        socialTitle: 'Social Media',
        whatsappAria: 'WhatsApp',
        instagramAria: 'Instagram',
        tripadvisorAria: 'Tripadvisor',
        formTitle: 'Send a Message',
        form: {
          nameLabel: 'Full Name',
          namePlaceholder: 'Your name and surname',
          emailLabel: 'Email',
          emailPlaceholder: 'example@email.com',
          messageLabel: 'Your Message',
          messagePlaceholder: 'Type your message here...',
          submit: 'Send',
        },
        mapTitle: 'GetTransfer Istanbul Office',
      },
      about: {
        badge: 'ABOUT US',
        title: '20 Years of Trust in Istanbul Airport Transfers',
        description:
          'We welcome international guests at Istanbul Airport and Sabiha Gokcen, providing comfortable, safe and on-time travel for hotel transfers, city rides and Turkey tour services.',
        stats: [
          {
            label: 'Years of Experience',
            value: '20+',
            detail: 'Strong operational know-how in Istanbul Airport and Sabiha Gokcen transfers.',
          },
          {
            label: 'Successful Transfers',
            value: '25,000+',
            detail: 'Completed airport, hotel and city transfer operations across Istanbul.',
          },
          {
            label: 'Happy Guests',
            value: '10,000+',
            detail: 'A reliable and well-planned arrival experience for guests coming from abroad.',
          },
          {
            label: 'Airport Meet & Greet',
            value: '24/7',
            detail: 'Meet-and-greet support scheduled around flight times, day and night.',
          },
        ],
        missionTitle: 'Our Mission',
        missionParagraphs: [
          'Our mission is to provide every guest arriving in Istanbul with a safe, comfortable and seamless transportation experience from the moment they land. With 20 years of hands-on experience, we make travel easier through flight tracking, on-time meet-and-greet service, professional drivers and a modern fleet.',
          'We aim to be more than a transfer company by supporting our guests not only with hotel transportation, but also with private chauffeur services in the city and Turkey tour planning.',
        ],
        missionChecklist: [
          'Airport meet and greet',
          'Hotel and city transfers',
          'Turkey tour and custom route support',
          'Professional drivers and comfortable vehicles',
        ],
        imageTags: [
          'Istanbul Airport',
          'Sabiha Gokcen',
          'Hotel Transfer',
          'City Transportation',
        ],
        whyTitle: 'Why Choose Us?',
        whyDescription:
          'For guests arriving in Istanbul, we offer a well-planned, transparent and confidence-inspiring transfer operation from airport pick-up to hotel transportation.',
        whyItems: [
          {
            title: '20 Years of Airport Experience',
            description:
              'With years of field experience in Istanbul Airport and Sabiha Gokcen transfers, we meet our guests at the right place and at the right time.',
          },
          {
            title: 'Welcoming International Guests',
            description:
              'For guests visiting Istanbul for the first time, we provide clear communication, easy meeting points and a reassuring arrival process.',
          },
          {
            title: 'Hotel, Transfer and Tour Services',
            description:
              'In addition to airport-to-hotel transfers, we also support city transportation, private routes and Turkey tour requests.',
          },
          {
            title: 'Transparent and Reliable Service',
            description:
              'We provide a trustworthy travel experience with clear pre-booking information, punctual service and a pricing policy without surprise costs.',
          },
        ],
        ctaTitle: 'Safe Transportation from the Moment You Land in Istanbul',
        ctaDescription:
          'Plan your reservation in just a few steps for Istanbul Airport, Sabiha Gokcen, hotel transfers, city transportation and Turkey tours.',
        ctaButton: 'Plan Your Transfer',
      },
      notFound: {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or may have been moved.',
        home: 'Home',
        search: 'Search Vehicles',
      },
      footer: {
        description: 'Reliable and comfortable transfer service from Istanbul airports.',
        contactTitle: 'Contact',
        quickLinksTitle: 'Quick Links',
        links: {
          about: 'About Us',
          contact: 'Contact',
          faq: 'Frequently Asked Questions',
        },
        rights: (year, company) => `© ${year} ${company}. All rights reserved.`,
        cashWarning: 'Payment is cash only. Cards are not accepted.',
      },
      general: {
        cashOnly: 'Payment is cash only. Cards are not accepted.',
        whatsappAria: 'Contact via WhatsApp',
      },
    },
  },
  de: {
    meta: {
      label: 'DE',
      name: 'Deutsch',
      flag: 'https://flagcdn.com/w40/de.png',
      locale: 'de-DE',
      direction: 'ltr',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'Transfer',
          tours: 'Touren',
          about: 'Über uns',
          contact: 'Kontakt',
          reservation: 'Reservierung',
        },
        languageMenuTitle: 'Sprache',
      },
      reservationBar: {
        tabs: {
          transfer: 'Transfer',
          hourly: 'Stundenmiete',
          tours: 'Touren',
        },
        placeholders: {
          from: 'Von (Flughafen, Hotel...)',
          to: 'Nach',
          datetime: 'Datum & Uhrzeit',
          returnDatetime: 'Rückfahrt Datum & Uhrzeit',
        },
        passengersOptionSuffix: 'Personen',
        swapAria: 'Orte tauschen',
        searchAria: 'Fahrzeug suchen',
        searchButton: 'Suchen',
        roundTrip: 'Hin- und Rückfahrt',
        comingSoon: 'Diese Funktion ist in Kürze verfügbar.',
      },
      home: {
        heroTitle: 'Wir sind an den Flughäfen an Ihrer Seite.',
        heroDescription:
          'Zuverlässiger Transferservice in Istanbul, Antalya, Bodrum, Dalaman, Izmir, Trabzon und vielen weiteren Städten.',
        cities,
        advantagesTitle: 'Warum GetTransfer Istanbul?',
        advantages: [
          {
            icon: 'plane',
            title: 'Pünktliche Abholung',
            description: 'Dank Flugverfolgung sind wir immer rechtzeitig am Flughafen.',
          },
          {
            icon: 'clock',
            title: '24/7 Service',
            description: 'Wir sind Tag und Nacht für Sie einsatzbereit.',
          },
          {
            icon: 'shield',
            title: 'Sichere Fahrt',
            description: 'Fühlen Sie sich sicher mit unseren professionellen Fahrern und versicherten Fahrzeugen.',
          },
          {
            icon: 'car',
            title: 'VIP-Fahrzeuge',
            description: 'Komfort durch eine große Auswahl von Economy bis VIP.',
          },
        ],
        citiesTitle: 'Städte, die wir bedienen',
        citiesDescription: 'Wir bieten Transfers an den führenden Flughäfen der Türkei an',
        faqTitle: 'Häufig gestellte Fragen',
        faq: [
          {
            question: 'Wie erfolgt die Bezahlung?',
            answer:
              'Die Bezahlung erfolgt ausschließlich bar beim Fahrer oder in unserem Büro. Kreditkarten werden nicht akzeptiert.',
          },
          {
            question: 'Was passiert bei Flugverspätungen?',
            answer:
              'Dank unseres Flugverfolgungssystems erkennen wir Verspätungen automatisch und der Fahrer wartet auf Sie. Es fallen keine Zusatzkosten an.',
          },
          {
            question: 'Wie ist Ihre Stornierungsrichtlinie?',
            answer:
              'Eine kostenlose Stornierung ist bis 24 Stunden vor dem Transfer möglich. Spätere Stornierungen können Zusatzkosten verursachen.',
          },
          {
            question: 'Gibt es ein Gepäcklimit?',
            answer:
              'Jeder Fahrzeugtyp hat eine unterschiedliche Gepäckkapazität. Diese sehen Sie bei der Reservierung entsprechend Ihrer Auswahl.',
          },
          {
            question: 'Bieten Sie Kindersitze an?',
            answer: 'Ja, auf Wunsch stellen wir kostenfrei einen Kindersitz zur Verfügung.',
          },
        ],
        ctaTitle: 'Jetzt buchen',
        ctaDescription: 'Planen Sie Ihren Flughafentransfer jetzt und genießen Sie eine komfortable Reise.',
        ctaButton: 'Transfer buchen',
      },
      results: {
        backButton: 'Zurück zur Suche',
        searchDetailsTitle: 'Suchdetails',
        labels: {
          from: 'Von',
          to: 'Nach',
          datetime: 'Datum & Uhrzeit',
          passengers: 'Personen',
          return: 'Rückfahrt',
          distance: 'Entfernung',
        },
        passengersSuffix: 'Personen',
        availableVehiclesTitle: 'Verfügbare Fahrzeuge',
        cashWarning: '⚠️ Zahlung nur in bar. Karten werden nicht akzeptiert.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'Economy Limousine',
            capacity: { passengers: 3, luggage: 2 },
            features: ['Klimaanlage', 'Bequeme Sitze', 'Erfahrener Fahrer', 'Kostenlose Stornierung (24 Std.)'],
          },
          {
            type: 'minivan',
            name: 'Minivan',
            capacity: { passengers: 6, luggage: 4 },
            features: ['Geräumiger Innenraum', 'Klimaanlage', 'USB-Ladung', 'Kostenlose Stornierung (24 Std.)'],
          },
          {
            type: 'vip-vito',
            name: 'VIP Mercedes Vito',
            capacity: { passengers: 6, luggage: 6 },
            features: [
              'Premium Ledersitze',
              'WLAN',
              'Kostenlose Getränke',
              'VIP-Fahrer',
              'Kostenlose Stornierung (48 Std.)',
            ],
          },
          {
            type: 'minibus',
            name: 'Minibus',
            capacity: { passengers: 14, luggage: 10 },
            features: ['Gruppentransfer', 'Großer Gepäckraum', 'Klimaanlage', 'Kostenlose Stornierung (24 Std.)'],
          },
          {
            type: 'bus',
            name: 'Reisebus',
            capacity: { passengers: 30, luggage: 30 },
            features: ['Große Gruppen', 'Bequeme Sitze', 'Klimaanlage', 'Professioneller Fahrer'],
          },
        ],
        passengersLabel: 'Personen',
        luggageLabel: 'Gepäck',
        estimatedPrice: 'Geschätzter Preis',
        selectButton: 'Auswählen',
      },
      booking: {
        backButton: 'Zurück zur Fahrzeugauswahl',
        title: 'Buchungsdetails',
        contactTitle: 'Kontaktinformationen',
        fields: {
          firstName: 'Vorname',
          firstNamePlaceholder: 'Ihr Vorname',
          lastName: 'Nachname',
          lastNamePlaceholder: 'Ihr Nachname',
          email: 'E-Mail',
          emailPlaceholder: 'beispiel@email.com',
          phone: 'Telefon',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'Buchungsnotiz (optional)',
          notesPlaceholder: 'z. B. Kindersitz benötigt, zusätzliches Gepäck...',
        },
        errors: {
          firstNameRequired: 'Vorname ist erforderlich',
          lastNameRequired: 'Nachname ist erforderlich',
          emailRequired: 'E-Mail ist erforderlich',
          emailInvalid: 'Bitte eine gültige E-Mail-Adresse eingeben',
          phoneRequired: 'Telefonnummer ist erforderlich',
          phoneInvalid: 'Bitte geben Sie eine gültige Telefonnummer ein',
        },
        submit: 'Buchung abschließen (Barzahlung)',
        submitting: 'Wird verarbeitet...',
        summaryTitle: 'Buchungsübersicht',
        summary: {
          route: 'Route',
          datetime: 'Datum & Uhrzeit',
          return: 'Rückfahrt',
          passengers: 'Personen',
          passengersSuffix: 'Personen',
          vehicle: 'Fahrzeug',
          estimatedPrice: 'Geschätzter Preis',
          cashNote: '💵 Die Zahlung erfolgt bar an den Fahrer.',
        },
        alerts: {
          genericError: 'Bei der Buchung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        },
      },
      confirm: {
        title: 'Ihre Buchung ist eingegangen!',
        description:
          'Ihre Anfrage wurde erfolgreich gespeichert. Unser Fahrer meldet sich in Kürze bei Ihnen, um die Details zu bestätigen.',
        cashTitle: '💵 Zahlungsinformation',
        cashMessage: 'Die Zahlung erfolgt bar an den Fahrer oder in unserem Büro. Kreditkarten werden nicht akzeptiert.',
        contactTitle: '📞 Kontakt',
        contactMessage:
          'Bei Fragen erreichen Sie uns über WhatsApp oder über die Schaltfläche unten rechts.',
        newSearch: 'Neue Suche',
        home: 'Startseite',
        referenceLabel: 'Reservierungsnummer',
      },
      contact: {
        title: 'Kontakt',
        description: 'Kontaktieren Sie uns bei Fragen. Wir helfen Ihnen gern weiter.',
        contactInfoTitle: 'Kontaktinformationen',
        phoneTitle: 'Telefon',
        emailTitle: 'E-Mail',
        addressTitle: 'Adresse',
        hoursTitle: 'Öffnungszeiten',
        hoursDescription: 'Wir sind 24/7 verfügbar',
        socialTitle: 'Soziale Medien',
        whatsappAria: 'WhatsApp',
        instagramAria: 'Instagram',
        tripadvisorAria: 'Tripadvisor',
        formTitle: 'Nachricht senden',
        form: {
          nameLabel: 'Vollständiger Name',
          namePlaceholder: 'Ihr Vor- und Nachname',
          emailLabel: 'E-Mail',
          emailPlaceholder: 'beispiel@email.com',
          messageLabel: 'Ihre Nachricht',
          messagePlaceholder: 'Schreiben Sie Ihre Nachricht...',
          submit: 'Senden',
        },
        mapTitle: 'GetTransfer Istanbul Büro',
      },
      about: {
        badge: 'ÜBER UNS',
        title: '20 Jahre Vertrauen bei Flughafentransfers in Istanbul',
        description:
          'Wir begrüßen internationale Gäste am Istanbul Airport und am Sabiha Gokcen Airport und bieten komfortable, sichere und pünktliche Fahrten für Hoteltransfers, Stadtfahrten und Türkei-Touren.',
        stats: [
          {
            label: 'Jahre Erfahrung',
            value: '20+',
            detail: 'Starke operative Erfahrung bei Transfers am Istanbul Airport und Sabiha Gokcen.',
          },
          {
            label: 'Erfolgreiche Transfers',
            value: '25.000+',
            detail: 'Durchgeführte Flughafen-, Hotel- und Stadttransferfahrten in Istanbul.',
          },
          {
            label: 'Zufriedene Gäste',
            value: '10.000+',
            detail: 'Ein verlässliches und gut geplantes Ankunftserlebnis für Gäste aus dem Ausland.',
          },
          {
            label: 'Flughafenempfang',
            value: '24/7',
            detail: 'Meet-and-greet-Service rund um die Uhr, passend zu den Flugzeiten.',
          },
        ],
        missionTitle: 'Unsere Mission',
        missionParagraphs: [
          'Unsere Mission ist es, jedem Gast, der in Istanbul ankommt, vom ersten Moment an eine sichere, komfortable und reibungslose Beförderung zu bieten. Mit 20 Jahren Praxiserfahrung erleichtern wir die Reise durch Flugverfolgung, pünktlichen Empfang, professionelle Fahrer und eine moderne Fahrzeugflotte.',
          'Wir möchten mehr sein als nur ein Transferunternehmen und unsere Gäste auch bei Hoteltransfers, privaten Fahrten in der Stadt und der Planung von Türkei-Touren zuverlässig begleiten.',
        ],
        missionChecklist: [
          'Empfang am Flughafen',
          'Hotel- und Stadttransfers',
          'Türkei-Touren und individuelle Routen',
          'Professionelle Fahrer und komfortable Fahrzeuge',
        ],
        imageTags: [
          'Istanbul Airport',
          'Sabiha Gokcen',
          'Hoteltransfer',
          'Stadttransport',
        ],
        whyTitle: 'Warum wir?',
        whyDescription:
          'Für Gäste, die in Istanbul ankommen, bieten wir einen gut geplanten, transparenten und vertrauenswürdigen Transferablauf vom Flughafen bis zum Hotel.',
        whyItems: [
          {
            title: '20 Jahre Flughafenerfahrung',
            description:
              'Mit langjähriger Erfahrung bei Transfers am Istanbul Airport und Sabiha Gokcen empfangen wir unsere Gäste am richtigen Ort und zur richtigen Zeit.',
          },
          {
            title: 'Empfang internationaler Gäste',
            description:
              'Für Gäste, die Istanbul zum ersten Mal besuchen, bieten wir klare Kommunikation, leicht verständliche Treffpunkte und einen sicheren Empfangsprozess.',
          },
          {
            title: 'Hotel-, Transfer- und Tourservice',
            description:
              'Neben Flughafen-Hotel-Transfers unterstützen wir auch bei Stadtfahrten, privaten Routen und Türkei-Touren.',
          },
          {
            title: 'Transparenter und zuverlässiger Service',
            description:
              'Mit klaren Informationen vor der Buchung, pünktlichem Service und einer Preisstruktur ohne Überraschungen sorgen wir für eine verlässliche Reise.',
          },
        ],
        ctaTitle: 'Sichere Mobilität ab Ihrer Landung in Istanbul',
        ctaDescription:
          'Planen Sie Ihre Reservierung in wenigen Schritten für Istanbul Airport, Sabiha Gokcen, Hoteltransfers, Stadtfahrten und Türkei-Touren.',
        ctaButton: 'Transfer planen',
      },
      notFound: {
        title: 'Seite nicht gefunden',
        description: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
        home: 'Startseite',
        search: 'Fahrzeuge suchen',
      },
      footer: {
        description: 'Zuverlässiger und komfortabler Transferservice ab den Flughäfen Istanbuls.',
        contactTitle: 'Kontakt',
        quickLinksTitle: 'Schnellzugriff',
        links: {
          about: 'Über uns',
          contact: 'Kontakt',
          faq: 'Häufig gestellte Fragen',
        },
        rights: (year, company) => `© ${year} ${company}. Alle Rechte vorbehalten.`,
        cashWarning: 'Zahlung nur in bar. Karten werden nicht akzeptiert.',
      },
      general: {
        cashOnly: 'Zahlung nur in bar. Karten werden nicht akzeptiert.',
        whatsappAria: 'Kontakt via WhatsApp',
      },
    },
  },
  fr: {
    meta: {
      label: 'FR',
      name: 'Français',
      flag: 'https://flagcdn.com/w40/fr.png',
      locale: 'fr-FR',
      direction: 'ltr',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'Transfert',
          tours: 'Tours',
          about: 'À propos',
          contact: 'Contact',
          reservation: 'Réservation',
        },
        languageMenuTitle: 'Langue',
      },
      reservationBar: {
        tabs: {
          transfer: 'Transfert',
          hourly: 'Location horaire',
          tours: 'Tours',
        },
        placeholders: {
          from: 'Départ (Aéroport, Hôtel...)',
          to: 'Destination',
          datetime: 'Date et heure',
          returnDatetime: 'Date et heure du retour',
        },
        passengersOptionSuffix: 'Passagers',
        swapAria: 'Inverser les lieux',
        searchAria: 'Rechercher un véhicule',
        searchButton: 'Rechercher',
        roundTrip: 'Aller-retour',
        comingSoon: 'Cette fonctionnalité sera bientôt disponible.',
      },
      home: {
        heroTitle: 'Nous sommes à vos côtés dans les aéroports.',
        heroDescription:
          "Service de transfert fiable à Istanbul, Antalya, Bodrum, Dalaman, Izmir, Trabzon et dans de nombreuses autres villes.",
        cities,
        advantagesTitle: 'Pourquoi GetTransfer Istanbul ?',
        advantages: [
          {
            icon: 'plane',
            title: 'Prise en charge ponctuelle',
            description: "Grâce au suivi des vols, nous sommes toujours à l'heure à l'aéroport.",
          },
          {
            icon: 'clock',
            title: 'Service 24h/24',
            description: 'Nous sommes prêts à vous servir jour et nuit.',
          },
          {
            icon: 'shield',
            title: 'Voyage sécurisé',
            description: 'Sentez-vous en sécurité grâce à nos chauffeurs professionnels et à nos véhicules assurés.',
          },
          {
            icon: 'car',
            title: 'Véhicules VIP',
            description: "Nous accordons de l'importance au confort avec un large choix allant de l'économie au VIP.",
          },
        ],
        citiesTitle: 'Villes desservies',
        citiesDescription: "Nous assurons des transferts dans les principaux aéroports de Turquie",
        faqTitle: 'Questions fréquentes',
        faq: [
          {
            question: 'Comment se fait le paiement ?',
            answer:
              "Le paiement s'effectue uniquement en espèces auprès du chauffeur ou dans notre bureau. Les cartes bancaires ne sont pas acceptées.",
          },
          {
            question: 'Que se passe-t-il en cas de retard de vol ?',
            answer:
              'Grâce à notre système de suivi des vols, nous détectons automatiquement les retards et notre chauffeur vous attend. Aucun frais supplémentaire.',
          },
          {
            question: "Quelle est votre politique d'annulation ?",
            answer:
              "Vous pouvez annuler gratuitement jusqu'à 24 heures avant le transfert. Passé ce délai, des frais peuvent s'appliquer.",
          },
          {
            question: 'Y a-t-il une limite de bagages ?',
            answer:
              'Chaque type de véhicule dispose d’une capacité de bagages différente. Elle est indiquée lors de la réservation selon votre choix.',
          },
          {
            question: 'Fournissez-vous des sièges enfant ?',
            answer:
              'Oui, indiquez-le dans vos notes de réservation et nous fournirons gratuitement un siège enfant.',
          },
        ],
        ctaTitle: 'Réservez dès maintenant',
        ctaDescription:
          "Planifiez votre transfert aéroport maintenant et profitez d'un trajet confortable.",
        ctaButton: 'Réserver un transfert',
      },
      results: {
        backButton: 'Retour à la recherche',
        searchDetailsTitle: 'Détails de la recherche',
        labels: {
          from: 'Départ',
          to: 'Destination',
          datetime: 'Date et heure',
          passengers: 'Passagers',
          return: 'Retour',
          distance: 'Distance',
        },
        passengersSuffix: 'Passagers',
        availableVehiclesTitle: 'Véhicules disponibles',
        cashWarning: '⚠️ Paiement en espèces uniquement. Cartes non acceptées.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'Berline économique',
            capacity: { passengers: 3, luggage: 2 },
            features: ['Climatisation', 'Sièges confortables', 'Chauffeur expérimenté', 'Annulation gratuite (24 h)'],
          },
          {
            type: 'minivan',
            name: 'Minivan',
            capacity: { passengers: 6, luggage: 4 },
            features: ['Habitacle spacieux', 'Climatisation', 'Charge USB', 'Annulation gratuite (24 h)'],
          },
          {
            type: 'vip-vito',
            name: 'Mercedes Vito VIP',
            capacity: { passengers: 6, luggage: 6 },
            features: [
              'Sièges en cuir premium',
              'Wi-Fi',
              'Eau offerte',
              'Chauffeur VIP',
              'Annulation gratuite (48 h)',
            ],
          },
          {
            type: 'minibus',
            name: 'Minibus',
            capacity: { passengers: 14, luggage: 10 },
            features: ['Transfert de groupe', 'Grand espace bagages', 'Climatisation', 'Annulation gratuite (24 h)'],
          },
          {
            type: 'bus',
            name: 'Autocar',
            capacity: { passengers: 30, luggage: 30 },
            features: ['Grandes capacités de groupe', 'Sièges confortables', 'Climatisation', 'Chauffeur professionnel'],
          },
        ],
        passengersLabel: 'Passagers',
        luggageLabel: 'Bagages',
        estimatedPrice: 'Prix estimé',
        selectButton: 'Sélectionner',
      },
      booking: {
        backButton: 'Retour à la sélection de véhicule',
        title: 'Détails de la réservation',
        contactTitle: 'Informations de contact',
        fields: {
          firstName: 'Prénom',
          firstNamePlaceholder: 'Votre prénom',
          lastName: 'Nom de famille',
          lastNamePlaceholder: 'Votre nom de famille',
          email: 'E-mail',
          emailPlaceholder: 'exemple@email.com',
          phone: 'Téléphone',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'Note de réservation (optionnel)',
          notesPlaceholder: "Ex. besoin d'un siège enfant, bagages supplémentaires...",
        },
        errors: {
          firstNameRequired: 'Le prénom est requis',
          lastNameRequired: 'Le nom de famille est requis',
          emailRequired: "L'e-mail est requis",
          emailInvalid: 'Veuillez saisir une adresse e-mail valide',
          phoneRequired: 'Le numéro de téléphone est requis',
          phoneInvalid: 'Veuillez saisir un numéro de téléphone valide',
        },
        submit: 'Terminer la réservation (Paiement en espèces)',
        submitting: 'Traitement...',
        summaryTitle: 'Récapitulatif de la réservation',
        summary: {
          route: 'Itinéraire',
          datetime: 'Date et heure',
          return: 'Retour',
          passengers: 'Passagers',
          passengersSuffix: 'Passagers',
          vehicle: 'Véhicule',
          estimatedPrice: 'Prix estimé',
          cashNote: '💵 Le paiement se fera en espèces auprès du chauffeur.',
        },
        alerts: {
          genericError: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.',
        },
      },
      confirm: {
        title: 'Votre réservation est confirmée !',
        description:
          'Votre demande a été enregistrée avec succès. Notre chauffeur vous contactera prochainement pour confirmer les détails.',
        cashTitle: '💵 Informations de paiement',
        cashMessage:
          "Le paiement s'effectue uniquement en espèces auprès du chauffeur ou dans notre bureau. Les cartes bancaires ne sont pas acceptées.",
        contactTitle: '📞 Contact',
        contactMessage:
          'Pour toute question, contactez-nous via WhatsApp ou utilisez le bouton en bas à droite.',
        newSearch: 'Nouvelle recherche',
        home: 'Accueil',
        referenceLabel: 'Numéro de réservation',
      },
      contact: {
        title: 'Contact',
        description: 'Contactez-nous pour toute question. Nous serons ravis de vous aider.',
        contactInfoTitle: 'Informations de contact',
        phoneTitle: 'Téléphone',
        emailTitle: 'E-mail',
        addressTitle: 'Adresse',
        hoursTitle: 'Horaires',
        hoursDescription: 'Service 24h/24 et 7j/7',
        socialTitle: 'Réseaux sociaux',
        whatsappAria: 'WhatsApp',
        instagramAria: 'Instagram',
        tripadvisorAria: 'Tripadvisor',
        formTitle: 'Envoyez un message',
        form: {
          nameLabel: 'Nom complet',
          namePlaceholder: 'Votre nom et prénom',
          emailLabel: 'E-mail',
          emailPlaceholder: 'exemple@email.com',
          messageLabel: 'Votre message',
          messagePlaceholder: 'Écrivez votre message ici...',
          submit: 'Envoyer',
        },
        mapTitle: 'Bureau GetTransfer Istanbul',
      },
      about: {
        badge: 'À PROPOS',
        title: '20 ans de confiance dans les transferts aéroport à Istanbul',
        description:
          'Nous accueillons les voyageurs internationaux à l’aéroport d’Istanbul et à Sabiha Gokcen, en offrant des trajets confortables, sûrs et ponctuels pour les transferts vers l’hôtel, les déplacements urbains et les circuits en Turquie.',
        stats: [
          {
            label: "Années d'expérience",
            value: '20+',
            detail: 'Une forte expérience opérationnelle sur les transferts à l’aéroport d’Istanbul et à Sabiha Gokcen.',
          },
          {
            label: 'Transferts réalisés',
            value: '25 000+',
            detail: 'Des opérations de transfert aéroport, hôtel et ville menées à bien à Istanbul.',
          },
          {
            label: 'Voyageurs satisfaits',
            value: '10 000+',
            detail: 'Une arrivée fiable et bien organisée pour les visiteurs venant de l’étranger.',
          },
          {
            label: 'Accueil aéroport',
            value: '24/7',
            detail: 'Un service d’accueil planifié selon les horaires de vol, de jour comme de nuit.',
          },
        ],
        missionTitle: 'Notre mission',
        missionParagraphs: [
          'Notre mission est d’offrir à chaque visiteur arrivant à Istanbul une expérience de transport sûre, confortable et sans stress dès l’aéroport. Forts de 20 ans d’expérience terrain, nous facilitons chaque trajet grâce au suivi des vols, à un accueil ponctuel, à des chauffeurs professionnels et à une flotte moderne.',
          'Nous voulons être plus qu’un simple service de transfert et accompagner nos voyageurs aussi bien pour les trajets vers l’hôtel que pour les services avec chauffeur en ville et les circuits en Turquie.',
        ],
        missionChecklist: [
          'Accueil à l’aéroport',
          'Transferts hôtel et ville',
          'Circuits en Turquie et itinéraires sur mesure',
          'Chauffeurs professionnels et véhicules confortables',
        ],
        imageTags: [
          'Aéroport d’Istanbul',
          'Sabiha Gokcen',
          'Transfert hôtel',
          'Transport urbain',
        ],
        whyTitle: 'Pourquoi nous choisir ?',
        whyDescription:
          'Pour les voyageurs arrivant à Istanbul, nous proposons une organisation de transfert claire, rassurante et transparente de l’aéroport jusqu’à l’hôtel.',
        whyItems: [
          {
            title: '20 ans d’expérience aéroportuaire',
            description:
              'Grâce à nos années d’expérience sur les transferts depuis l’aéroport d’Istanbul et Sabiha Gokcen, nous accueillons nos voyageurs au bon endroit et au bon moment.',
          },
          {
            title: 'Accueil des visiteurs internationaux',
            description:
              'Pour les visiteurs qui découvrent Istanbul pour la première fois, nous proposons une communication claire, un point de rendez-vous simple et un accueil rassurant.',
          },
          {
            title: 'Hôtel, transferts et circuits',
            description:
              'En plus des transferts aéroport-hôtel, nous accompagnons aussi les trajets urbains, les itinéraires privés et les demandes de circuit en Turquie.',
          },
          {
            title: 'Service fiable et transparent',
            description:
              'Nous assurons un voyage fiable grâce à des informations claires avant réservation, un service ponctuel et une politique tarifaire sans surprise.',
          },
        ],
        ctaTitle: 'Un transport sûr dès votre arrivée à Istanbul',
        ctaDescription:
          'Planifiez votre réservation en quelques étapes pour l’aéroport d’Istanbul, Sabiha Gokcen, les transferts vers l’hôtel, les trajets urbains et les circuits en Turquie.',
        ctaButton: 'Planifier mon transfert',
      },
      notFound: {
        title: 'Page introuvable',
        description: "La page que vous recherchez n'existe pas ou a peut-être été déplacée.",
        home: 'Accueil',
        search: 'Rechercher des véhicules',
      },
      footer: {
        description: "Service de transfert fiable et confortable depuis les aéroports d'Istanbul.",
        contactTitle: 'Contact',
        quickLinksTitle: 'Liens rapides',
        links: {
          about: 'À propos',
          contact: 'Contact',
          faq: 'Questions fréquentes',
        },
        rights: (year, company) => `© ${year} ${company}. Tous droits réservés.`,
        cashWarning: 'Paiement en espèces uniquement. Cartes non acceptées.',
      },
      general: {
        cashOnly: 'Paiement en espèces uniquement. Cartes non acceptées.',
        whatsappAria: 'Contacter via WhatsApp',
      },
    },
  },
  it: {
    meta: {
      label: 'IT',
      name: 'Italiano',
      flag: 'https://flagcdn.com/w40/it.png',
      locale: 'it-IT',
      direction: 'ltr',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'Transfer',
          tours: 'Tour',
          about: 'Chi siamo',
          contact: 'Contatti',
          reservation: 'Prenotazione',
        },
        languageMenuTitle: 'Lingua',
      },
      reservationBar: {
        tabs: {
          transfer: 'Transfer',
          hourly: 'Noleggio orario',
          tours: 'Tour',
        },
        placeholders: {
          from: 'Partenza (Aeroporto, Hotel...)',
          to: 'Arrivo',
          datetime: 'Data e ora',
          returnDatetime: 'Data e ora del ritorno',
        },
        passengersOptionSuffix: 'Passeggeri',
        swapAria: 'Inverti le località',
        searchAria: 'Cerca veicolo',
        searchButton: 'Cerca',
        roundTrip: 'Andata e ritorno',
        comingSoon: 'Questa funzione sarà disponibile a breve.',
      },
      home: {
        heroTitle: 'Siamo al tuo fianco negli aeroporti.',
        heroDescription:
          'Servizio transfer affidabile a Istanbul, Antalya, Bodrum, Dalaman, Izmir, Trabzon e in molte altre città.',
        cities,
        advantagesTitle: 'Perché GetTransfer Istanbul?',
        advantages: [
          {
            icon: 'plane',
            title: 'Ritiro puntuale',
            description: 'Grazie al monitoraggio dei voli siamo sempre puntuali in aeroporto.',
          },
          {
            icon: 'clock',
            title: 'Servizio 24/7',
            description: 'Siamo pronti a servirti giorno e notte.',
          },
          {
            icon: 'shield',
            title: 'Viaggio sicuro',
            description: 'Sentiti al sicuro con i nostri autisti professionisti e veicoli assicurati.',
          },
          {
            icon: 'car',
            title: 'Veicoli VIP',
            description: 'Comfort garantito con un’ampia gamma di veicoli, dall’economico al VIP.',
          },
        ],
        citiesTitle: 'Città servite',
        citiesDescription: 'Offriamo trasferimenti nei principali aeroporti della Turchia',
        faqTitle: 'Domande frequenti',
        faq: [
          {
            question: 'Come avviene il pagamento?',
            answer:
              "Il pagamento avviene esclusivamente in contanti all'autista o nel nostro ufficio. Le carte non sono accettate.",
          },
          {
            question: 'Cosa succede se il volo è in ritardo?',
            answer:
              'Grazie al nostro sistema di monitoraggio dei voli rileviamo automaticamente i ritardi e il nostro autista ti aspetta senza costi aggiuntivi.',
          },
          {
            question: 'Qual è la vostra politica di cancellazione?',
            answer:
              "Puoi cancellare gratuitamente fino a 24 ore prima dell'orario del transfer. Le cancellazioni successive possono prevedere costi aggiuntivi.",
          },
          {
            question: 'Esiste un limite di bagagli?',
            answer:
              'Ogni tipologia di veicolo ha una diversa capacità di bagagli, indicata durante la prenotazione in base al veicolo scelto.',
          },
          {
            question: 'Fornite seggiolini per bambini?',
            answer:
              'Sì, indicandolo nelle note della prenotazione forniamo gratuitamente un seggiolino per bambini.',
          },
        ],
        ctaTitle: 'Prenota ora',
        ctaDescription:
          'Pianifica subito il tuo transfer aeroportuale e goditi un viaggio confortevole.',
        ctaButton: 'Prenota un transfer',
      },
      results: {
        backButton: 'Torna alla ricerca',
        searchDetailsTitle: 'Dettagli della ricerca',
        labels: {
          from: 'Partenza',
          to: 'Arrivo',
          datetime: 'Data e ora',
          passengers: 'Passeggeri',
          return: 'Ritorno',
          distance: 'Distanza',
        },
        passengersSuffix: 'Passeggeri',
        availableVehiclesTitle: 'Veicoli disponibili',
        cashWarning: '⚠️ Pagamento solo in contanti. Carte non accettate.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'Berlina economica',
            capacity: { passengers: 3, luggage: 2 },
            features: ['Climatizzazione', 'Sedili comodi', 'Autista esperto', 'Cancellazione gratuita (24 h)'],
          },
          {
            type: 'minivan',
            name: 'Minivan',
            capacity: { passengers: 6, luggage: 4 },
            features: ['Ampio spazio interno', 'Climatizzazione', 'Ricarica USB', 'Cancellazione gratuita (24 h)'],
          },
          {
            type: 'vip-vito',
            name: 'Mercedes Vito VIP',
            capacity: { passengers: 6, luggage: 6 },
            features: [
              'Sedili in pelle premium',
              'Wi-Fi',
              'Acqua in omaggio',
              'Autista VIP',
              'Cancellazione gratuita (48 h)',
            ],
          },
          {
            type: 'minibus',
            name: 'Minibus',
            capacity: { passengers: 14, luggage: 10 },
            features: ['Trasferimento di gruppo', 'Ampio bagagliaio', 'Climatizzazione', 'Cancellazione gratuita (24 h)'],
          },
          {
            type: 'bus',
            name: 'Autobus',
            capacity: { passengers: 30, luggage: 30 },
            features: ['Grandi gruppi', 'Sedili confortevoli', 'Climatizzazione', 'Autista professionista'],
          },
        ],
        passengersLabel: 'Passeggeri',
        luggageLabel: 'Bagagli',
        estimatedPrice: 'Prezzo stimato',
        selectButton: 'Seleziona',
      },
      booking: {
        backButton: 'Torna alla selezione del veicolo',
        title: 'Dettagli della prenotazione',
        contactTitle: 'Informazioni di contatto',
        fields: {
          firstName: 'Nome',
          firstNamePlaceholder: 'Il tuo nome',
          lastName: 'Cognome',
          lastNamePlaceholder: 'Il tuo cognome',
          email: 'Email',
          emailPlaceholder: 'esempio@email.com',
          phone: 'Telefono',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'Nota di prenotazione (opzionale)',
          notesPlaceholder: 'Es. seggiolino per bambini, bagagli extra...',
        },
        errors: {
          firstNameRequired: 'Il nome è obbligatorio',
          lastNameRequired: 'Il cognome è obbligatorio',
          emailRequired: "L'email è obbligatoria",
          emailInvalid: 'Inserisci un indirizzo email valido',
          phoneRequired: 'Il numero di telefono è obbligatorio',
          phoneInvalid: 'Inserisci un numero di telefono valido',
        },
        submit: 'Completa la prenotazione (Pagamento in contanti)',
        submitting: 'Elaborazione...',
        summaryTitle: 'Riepilogo prenotazione',
        summary: {
          route: 'Itinerario',
          datetime: 'Data e ora',
          return: 'Ritorno',
          passengers: 'Passeggeri',
          passengersSuffix: 'Passeggeri',
          vehicle: 'Veicolo',
          estimatedPrice: 'Prezzo stimato',
          cashNote: "💵 Il pagamento avverrà in contanti all'autista.",
        },
        alerts: {
          genericError: 'Si è verificato un errore durante la prenotazione. Riprova.',
        },
      },
      confirm: {
        title: 'La tua prenotazione è stata ricevuta!',
        description:
          "La tua richiesta è stata registrata con successo. Il nostro autista ti contatterà a breve per confermare i dettagli.",
        cashTitle: '💵 Informazioni di pagamento',
        cashMessage:
          "Il pagamento avviene in contanti all'autista o nel nostro ufficio. Le carte non sono accettate.",
        contactTitle: '📞 Contatti',
        contactMessage:
          'Per qualsiasi domanda contattaci su WhatsApp o utilizza il pulsante in basso a destra.',
        newSearch: 'Nuova ricerca',
        home: 'Home',
        referenceLabel: 'Numero di prenotazione',
      },
      contact: {
        title: 'Contatti',
        description: 'Contattaci per qualsiasi domanda. Saremo felici di aiutarti.',
        contactInfoTitle: 'Informazioni di contatto',
        phoneTitle: 'Telefono',
        emailTitle: 'E-mail',
        addressTitle: 'Indirizzo',
        hoursTitle: 'Orari di servizio',
        hoursDescription: 'Servizio attivo 24/7',
        socialTitle: 'Social media',
        whatsappAria: 'WhatsApp',
        instagramAria: 'Instagram',
        tripadvisorAria: 'Tripadvisor',
        formTitle: 'Invia un messaggio',
        form: {
          nameLabel: 'Nome e cognome',
          namePlaceholder: 'Il tuo nome e cognome',
          emailLabel: 'E-mail',
          emailPlaceholder: 'esempio@email.com',
          messageLabel: 'Messaggio',
          messagePlaceholder: 'Scrivi qui il tuo messaggio...',
          submit: 'Invia',
        },
        mapTitle: 'Ufficio GetTransfer Istanbul',
      },
      about: {
        badge: 'CHI SIAMO',
        title: '20 anni di fiducia nei transfer aeroportuali a Istanbul',
        description:
          'Accogliamo gli ospiti internazionali all’Aeroporto di Istanbul e a Sabiha Gokcen, offrendo viaggi comodi, sicuri e puntuali per transfer hotel, spostamenti in città e tour in Turchia.',
        stats: [
          {
            label: 'Anni di esperienza',
            value: '20+',
            detail: 'Solida esperienza operativa nei transfer dall’Aeroporto di Istanbul e da Sabiha Gokcen.',
          },
          {
            label: 'Transfer completati',
            value: '25.000+',
            detail: 'Servizi aeroportuali, hotel e urbani completati con successo a Istanbul.',
          },
          {
            label: 'Ospiti soddisfatti',
            value: '10.000+',
            detail: 'Un arrivo affidabile e ben organizzato per chi arriva dall’estero.',
          },
          {
            label: 'Accoglienza in aeroporto',
            value: '24/7',
            detail: 'Servizio di meet-and-greet attivo giorno e notte in base agli orari dei voli.',
          },
        ],
        missionTitle: 'La nostra missione',
        missionParagraphs: [
          'La nostra missione è offrire a ogni ospite che arriva a Istanbul un’esperienza di trasporto sicura, confortevole e senza problemi fin dall’aeroporto. Con 20 anni di esperienza sul campo, semplifichiamo ogni viaggio grazie al monitoraggio dei voli, all’accoglienza puntuale, a conducenti professionali e a una flotta moderna.',
          'Vogliamo essere più di un semplice servizio di transfer e accompagnare i nostri ospiti anche nei trasferimenti verso l’hotel, nei servizi con autista in città e nella pianificazione dei tour in Turchia.',
        ],
        missionChecklist: [
          'Accoglienza in aeroporto',
          'Transfer hotel e città',
          'Tour in Turchia e itinerari personalizzati',
          'Autisti professionali e veicoli confortevoli',
        ],
        imageTags: [
          'Aeroporto di Istanbul',
          'Sabiha Gokcen',
          'Transfer hotel',
          'Trasporto urbano',
        ],
        whyTitle: 'Perché sceglierci?',
        whyDescription:
          'Per chi arriva a Istanbul offriamo un servizio di transfer ben organizzato, trasparente e affidabile dall’aeroporto fino all’hotel.',
        whyItems: [
          {
            title: '20 anni di esperienza aeroportuale',
            description:
              'Grazie alla nostra esperienza nei transfer dall’Aeroporto di Istanbul e da Sabiha Gokcen, accogliamo gli ospiti nel punto giusto e al momento giusto.',
          },
          {
            title: 'Accoglienza per ospiti internazionali',
            description:
              'Per chi visita Istanbul per la prima volta offriamo comunicazione chiara, punto d’incontro semplice e un processo di accoglienza rassicurante.',
          },
          {
            title: 'Hotel, transfer e tour',
            description:
              'Oltre ai transfer aeroporto-hotel, supportiamo anche spostamenti urbani, percorsi privati e richieste di tour in Turchia.',
          },
          {
            title: 'Servizio trasparente e affidabile',
            description:
              'Offriamo un viaggio affidabile con informazioni chiare prima della prenotazione, puntualità e una politica di prezzo senza costi inattesi.',
          },
        ],
        ctaTitle: 'Trasporto sicuro dal momento in cui atterri a Istanbul',
        ctaDescription:
          'Pianifica la tua prenotazione in pochi passaggi per l’Aeroporto di Istanbul, Sabiha Gokcen, transfer hotel, spostamenti in città e tour in Turchia.',
        ctaButton: 'Pianifica il transfer',
      },
      notFound: {
        title: 'Pagina non trovata',
        description: 'La pagina richiesta non esiste o potrebbe essere stata spostata.',
        home: 'Home',
        search: 'Cerca veicoli',
      },
      footer: {
        description: 'Servizio di transfer affidabile e confortevole dagli aeroporti di Istanbul.',
        contactTitle: 'Contatti',
        quickLinksTitle: 'Link rapidi',
        links: {
          about: 'Chi siamo',
          contact: 'Contatti',
          faq: 'Domande frequenti',
        },
        rights: (year, company) => `© ${year} ${company}. Tutti i diritti riservati.`,
        cashWarning: 'Pagamento solo in contanti. Carte non accettate.',
      },
      general: {
        cashOnly: 'Pagamento solo in contanti. Carte non accettate.',
        whatsappAria: 'Contatta via WhatsApp',
      },
    },
  },
  ar: {
    meta: {
      label: 'AR',
      name: 'العربية',
      flag: 'https://flagcdn.com/w40/sa.png',
      locale: 'ar-SA',
      direction: 'rtl',
    },
    dictionary: {
      header: {
        nav: {
          transfer: 'النقل',
          tours: 'الجولات',
          about: 'من نحن',
          contact: 'اتصل بنا',
          reservation: 'الحجز',
        },
        languageMenuTitle: 'اللغة',
      },
      reservationBar: {
        tabs: {
          transfer: 'النقل',
          hourly: 'التأجير بالساعة',
          tours: 'الجولات',
        },
        placeholders: {
          from: 'من (مطار، فندق...)',
          to: 'إلى',
          datetime: 'التاريخ والوقت',
          returnDatetime: 'تاريخ ووقت العودة',
        },
        passengersOptionSuffix: 'راكب',
        swapAria: 'تبديل المواقع',
        searchAria: 'ابحث عن مركبة',
        searchButton: 'بحث',
        roundTrip: 'ذهاب وعودة',
        comingSoon: 'هذه الميزة ستكون متاحة قريبًا.',
      },
      home: {
        heroTitle: 'نحن إلى جانبك في المطارات.',
        heroDescription:
          'خدمة نقل موثوقة في إسطنبول، أنطاليا، بودروم، دالامان، إزمير، طرابزون والعديد من المدن الأخرى.',
        cities: [
          'إسطنبول',
          'أنطاليا',
          'بودروم',
          'دالامان',
          'إزمير',
          'طرابزون',
          'نوشهير',
          'قيصري',
          'غازي عنتاب',
          'أضنة',
        ],
        advantagesTitle: 'لماذا GetTransfer Istanbul؟',
        advantages: [
          {
            icon: 'plane',
            title: 'استقبال في الوقت المحدد',
            description: 'بفضل نظام تتبع الرحلات نكون دائمًا في المطار في الوقت المناسب.',
          },
          {
            icon: 'clock',
            title: 'خدمة على مدار الساعة',
            description: 'نحن جاهزون لخدمتك ليلًا ونهارًا.',
          },
          {
            icon: 'shield',
            title: 'رحلة آمنة',
            description: 'اشعر بالأمان مع سائقينا المحترفين ومركباتنا المؤمنة.',
          },
          {
            icon: 'car',
            title: 'مركبات فاخرة',
            description: 'نولي الراحة اهتمامًا خاصًا مع مجموعة واسعة من المركبات من الاقتصادية إلى VIP.',
          },
        ],
        citiesTitle: 'المدن التي نخدمها',
        citiesDescription: 'نقدم خدمة النقل في أبرز مطارات تركيا',
        faqTitle: 'الأسئلة الشائعة',
        faq: [
          {
            question: 'كيف يتم الدفع؟',
            answer:
              'يتم الدفع نقدًا فقط للسائق أو في مكتبنا. لا نقبل بطاقات الدفع.',
          },
          {
            question: 'ماذا يحدث إذا تأخرت الرحلة؟',
            answer:
              'بفضل نظام تتبع الرحلات نرصد التأخيرات تلقائيًا ويظل السائق بانتظارك دون أي رسوم إضافية.',
          },
          {
            question: 'ما هي سياسة الإلغاء لديكم؟',
            answer:
              'يمكنك الإلغاء مجانًا حتى 24 ساعة قبل موعد النقل. قد تُفرض رسوم على الإلغاءات المتأخرة.',
          },
          {
            question: 'هل توجد حدود للأمتعة؟',
            answer:
              'لكل نوع من المركبات سعة مختلفة للأمتعة، وستجد التفاصيل أثناء الحجز وفقًا للمركبة المختارة.',
          },
          {
            question: 'هل توفرون مقاعد للأطفال؟',
            answer:
              'نعم، عند ذكر ذلك في ملاحظات الحجز نوفر مقعد أطفال مجانًا.',
          },
        ],
        ctaTitle: 'احجز الآن',
        ctaDescription: 'خطط لنقلك من المطار الآن واستمتع برحلة مريحة.',
        ctaButton: 'احجز نقلك',
      },
      results: {
        backButton: 'العودة إلى البحث',
        searchDetailsTitle: 'تفاصيل البحث',
        labels: {
          from: 'من',
          to: 'إلى',
          datetime: 'التاريخ والوقت',
          passengers: 'عدد الركاب',
          return: 'العودة',
          distance: 'المسافة',
        },
        passengersSuffix: 'راكب',
        availableVehiclesTitle: 'المركبات المتاحة',
        cashWarning: '⚠️ الدفع نقدًا فقط. لا نقبل البطاقات.',
      },
      vehicles: {
        cards: [
          {
            type: 'economy',
            name: 'سيارة سيدان اقتصادية',
            capacity: { passengers: 3, luggage: 2 },
            features: ['مكيفة', 'مقاعد مريحة', 'سائق محترف', 'إلغاء مجاني (24 ساعة)'],
          },
          {
            type: 'minivan',
            name: 'ميني فان',
            capacity: { passengers: 6, luggage: 4 },
            features: ['مساحة داخلية واسعة', 'مكيفة', 'شحن USB', 'إلغاء مجاني (24 ساعة)'],
          },
          {
            type: 'vip-vito',
            name: 'مرسيدس فيتو VIP',
            capacity: { passengers: 6, luggage: 6 },
            features: ['مقاعد جلدية فاخرة', 'واي فاي', 'مياه ضيافة', 'سائق VIP', 'إلغاء مجاني (48 ساعة)'],
          },
          {
            type: 'minibus',
            name: 'ميني باص',
            capacity: { passengers: 14, luggage: 10 },
            features: ['نقل للمجموعات', 'مساحة أمتعة كبيرة', 'مكيفة', 'إلغاء مجاني (24 ساعة)'],
          },
          {
            type: 'bus',
            name: 'حافلة',
            capacity: { passengers: 30, luggage: 30 },
            features: ['نقل للمجموعات الكبيرة', 'مقاعد مريحة', 'مكيفة', 'سائق محترف'],
          },
        ],
        passengersLabel: 'ركاب',
        luggageLabel: 'حقائب',
        estimatedPrice: 'السعر التقديري',
        selectButton: 'اختر',
      },
      booking: {
        backButton: 'العودة إلى اختيار المركبة',
        title: 'تفاصيل الحجز',
        contactTitle: 'معلومات الاتصال',
        fields: {
          firstName: 'الاسم الأول',
          firstNamePlaceholder: 'اكتب اسمك',
          lastName: 'اسم العائلة',
          lastNamePlaceholder: 'اكتب اسم عائلتك',
          email: 'البريد الإلكتروني',
          emailPlaceholder: 'example@email.com',
          phone: 'الهاتف',
          phonePlaceholder: '(555) 123 45 67',
          notes: 'ملاحظات الحجز (اختياري)',
          notesPlaceholder: 'مثال: أحتاج إلى مقعد أطفال، توجد أمتعة إضافية...',
        },
        errors: {
          firstNameRequired: 'الاسم الأول مطلوب',
          lastNameRequired: 'اسم العائلة مطلوب',
          emailRequired: 'البريد الإلكتروني مطلوب',
          emailInvalid: 'يرجى إدخال بريد إلكتروني صالح',
          phoneRequired: 'رقم الهاتف مطلوب',
          phoneInvalid: 'يرجى إدخال رقم هاتف صالح',
        },
        submit: 'إكمال الحجز (دفع نقدي)',
        submitting: 'جارٍ المعالجة...',
        summaryTitle: 'ملخص الحجز',
        summary: {
          route: 'المسار',
          datetime: 'التاريخ والوقت',
          return: 'العودة',
          passengers: 'عدد الركاب',
          passengersSuffix: 'راكب',
          vehicle: 'المركبة',
          estimatedPrice: 'السعر التقديري',
          cashNote: '💵 سيتم الدفع نقدًا للسائق.',
        },
        alerts: {
          genericError: 'حدث خطأ أثناء إنشاء الحجز. يرجى المحاولة مرة أخرى.',
        },
      },
      confirm: {
        title: 'تم استلام حجزك!',
        description:
          'تم حفظ طلبك بنجاح. سيتواصل معك السائق قريبًا لتأكيد التفاصيل.',
        cashTitle: '💵 معلومات الدفع',
        cashMessage: 'يتم الدفع نقدًا فقط للسائق أو في مكتبنا. لا نقبل بطاقات الدفع.',
        contactTitle: '📞 التواصل',
        contactMessage:
          'لأي أسئلة، تواصل معنا عبر واتساب أو استخدم الزر في أسفل اليمين لإرسال رسالة.',
        newSearch: 'بحث جديد',
        home: 'الصفحة الرئيسية',
        referenceLabel: 'رقم الحجز',
      },
      contact: {
        title: 'اتصل بنا',
        description: 'تواصل معنا لأي أسئلة. يسعدنا مساعدتك.',
        contactInfoTitle: 'معلومات الاتصال',
        phoneTitle: 'الهاتف',
        emailTitle: 'البريد الإلكتروني',
        addressTitle: 'العنوان',
        hoursTitle: 'ساعات العمل',
        hoursDescription: 'نقدم الخدمة على مدار 24 ساعة طوال أيام الأسبوع',
        socialTitle: 'وسائل التواصل الاجتماعي',
        whatsappAria: 'واتساب',
        instagramAria: 'إنستغرام',
        tripadvisorAria: 'تريب أدفايزر',
        formTitle: 'أرسل رسالة',
        form: {
          nameLabel: 'الاسم الكامل',
          namePlaceholder: 'اسمك الكامل',
          emailLabel: 'البريد الإلكتروني',
          emailPlaceholder: 'example@email.com',
          messageLabel: 'رسالتك',
          messagePlaceholder: 'اكتب رسالتك هنا...',
          submit: 'إرسال',
        },
        mapTitle: 'مكتب GetTransfer في إسطنبول',
      },
      about: {
        badge: 'من نحن',
        title: '20 عامًا من الثقة في نقل مطارات إسطنبول',
        description:
          'نستقبل الضيوف القادمين من الخارج في مطار إسطنبول ومطار صبيحة كوكجن، ونوفر رحلات مريحة وآمنة وفي الوقت المحدد لخدمات النقل إلى الفندق والتنقل داخل المدينة والجولات في تركيا.',
        stats: [
          {
            label: 'سنوات الخبرة',
            value: '20+',
            detail: 'خبرة تشغيلية قوية في خدمات النقل من مطار إسطنبول وصبيحة كوكجن.',
          },
          {
            label: 'رحلات ناجحة',
            value: '25,000+',
            detail: 'عمليات نقل مكتملة بنجاح بين المطار والفندق وداخل المدينة في إسطنبول.',
          },
          {
            label: 'ضيوف سعداء',
            value: '10,000+',
            detail: 'تجربة وصول موثوقة ومنظمة للضيوف القادمين من الخارج.',
          },
          {
            label: 'استقبال في المطار',
            value: '24/7',
            detail: 'خدمة استقبال على مدار الساعة وفقًا لمواعيد الرحلات.',
          },
        ],
        missionTitle: 'مهمتنا',
        missionParagraphs: [
          'مهمتنا هي تقديم تجربة نقل آمنة ومريحة وسلسة لكل ضيف يصل إلى إسطنبول منذ لحظة خروجه من المطار. وبفضل خبرتنا الميدانية الممتدة لـ20 عامًا، نجعل الرحلة أسهل من خلال متابعة الرحلات والاستقبال في الوقت المحدد والسائقين المحترفين وأسطول السيارات الحديث.',
          'لا نكتفي بخدمة النقل فقط، بل نهدف أيضًا إلى أن نكون شريكًا موثوقًا لضيوفنا في الوصول إلى الفندق والتنقل داخل المدينة وتخطيط الجولات في تركيا.',
        ],
        missionChecklist: [
          'الاستقبال في المطار',
          'النقل إلى الفندق وداخل المدينة',
          'دعم الجولات في تركيا والمسارات الخاصة',
          'سائقون محترفون ومركبات مريحة',
        ],
        imageTags: [
          'مطار إسطنبول',
          'صبيحة كوكجن',
          'النقل إلى الفندق',
          'التنقل داخل المدينة',
        ],
        whyTitle: 'لماذا تختارنا؟',
        whyDescription:
          'نقدم للضيوف القادمين إلى إسطنبول خدمة نقل منظمة وشفافة وتبعث على الثقة من الاستقبال في المطار حتى الوصول إلى الفندق.',
        whyItems: [
          {
            title: '20 عامًا من خبرة المطارات',
            description:
              'بفضل خبرتنا الطويلة في خدمات النقل من مطار إسطنبول وصبيحة كوكجن، نستقبل ضيوفنا في المكان الصحيح وفي الوقت المناسب.',
          },
          {
            title: 'استقبال الضيوف القادمين من الخارج',
            description:
              'لمن يزور إسطنبول للمرة الأولى نوفر تواصلًا واضحًا ونقطة لقاء سهلة وعملية استقبال مريحة وتبعث على الاطمئنان.',
          },
          {
            title: 'خدمات الفندق والنقل والجولات',
            description:
              'إلى جانب النقل بين المطار والفندق، ندعم أيضًا التنقل داخل المدينة والمسارات الخاصة وطلبات الجولات في تركيا.',
          },
          {
            title: 'خدمة موثوقة وشفافة',
            description:
              'نقدم رحلة موثوقة بفضل المعلومات الواضحة قبل الحجز والخدمة في الوقت المحدد وسياسة أسعار من دون تكاليف مفاجئة.',
          },
        ],
        ctaTitle: 'نقل آمن منذ لحظة وصولك إلى إسطنبول',
        ctaDescription:
          'خطط لحجزك في بضع خطوات لمطار إسطنبول وصبيحة كوكجن والنقل إلى الفندق والتنقل داخل المدينة والجولات في تركيا.',
        ctaButton: 'خطط للنقل',
      },
      notFound: {
        title: 'الصفحة غير موجودة',
        description: 'الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.',
        home: 'الصفحة الرئيسية',
        search: 'ابحث عن مركبة',
      },
      footer: {
        description: 'خدمة نقل موثوقة ومريحة من مطارات إسطنبول.',
        contactTitle: 'اتصل بنا',
        quickLinksTitle: 'روابط سريعة',
        links: {
          about: 'من نحن',
          contact: 'اتصل بنا',
          faq: 'الأسئلة الشائعة',
        },
        rights: (year, company) => `© ${year} ${company}. جميع الحقوق محفوظة.`,
        cashWarning: 'الدفع نقدًا فقط. لا نقبل البطاقات.',
      },
      general: {
        cashOnly: 'الدفع نقدًا فقط. لا نقبل البطاقات.',
        whatsappAria: 'التواصل عبر واتساب',
      },
    },
  },
};
