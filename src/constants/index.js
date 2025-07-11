export const COUNTRIES = {
  'BE': { 
    name: 'Belgium', 
    nameTR: 'Belçika', 
    currency: 'EUR' 
  },
  'TR': { 
    name: 'Turkey', 
    nameTR: 'Türkiye', 
    currency: 'TRY' 
  },
  'FR': { 
    name: 'France', 
    nameTR: 'Fransa', 
    currency: 'EUR' 
  },
  'DE': { 
    name: 'Germany', 
    nameTR: 'Almanya', 
    currency: 'EUR' 
  }
};

export const STATUS_DISPLAY = {
  'SAVED_AS_UBL': { 
    en: 'Saved as UBL', 
    tr: 'UBL Olarak Kaydedildi' 
  },
  'SAVED_AS_PDF': { 
    en: 'Saved as PDF', 
    tr: 'PDF Olarak Kaydedildi' 
  },
  'SAVED_AS_ZUGFERD': { 
    en: 'Saved as ZUGFeRD', 
    tr: 'ZUGFeRD Olarak Kaydedildi' 
  }
};

export const PAYMENT_STATUS_DISPLAY = {
  'SENT': { 
    en: 'Sent', 
    tr: 'Gönderildi' 
  },
  'LATE': { 
    en: 'Late', 
    tr: 'Gecikmiş' 
  }
};

export const COUNTRY_OPTIONS = Object.keys(COUNTRIES);
export const CURRENCIES = ['EUR', 'TRY'];
export const INVOICE_TYPES = ['XRECHNUNG', 'PDF', 'ZUGFERD'];
export const PAYMENT_STATUSES = ['SENT', 'LATE'];
export const INVOICE_STATUSES = ['SAVED_AS_UBL', 'SAVED_AS_PDF', 'SAVED_AS_ZUGFERD'];

export const getStatusColor = (status) => {
  switch (status) {
    case 'SAVED_AS_UBL': return 'blue';
    case 'SAVED_AS_PDF': return 'green';
    case 'SAVED_AS_ZUGFERD': return 'purple';
    default: return 'default';
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'SENT': return 'orange';
    case 'LATE': return 'red';
    default: return 'default';
  }
};

export const getCountryName = (countryCode, language = 'en') => {
  if (!countryCode || !COUNTRIES[countryCode]) return countryCode || '-';
  return language === 'tr' ? COUNTRIES[countryCode].nameTR : COUNTRIES[countryCode].name;
};

export const getStatusDisplay = (status, language = 'en') => {
  if (!status || !STATUS_DISPLAY[status]) return status || '-';
  return language === 'tr' ? STATUS_DISPLAY[status].tr : STATUS_DISPLAY[status].en;
};

export const getPaymentStatusDisplay = (paymentStatus, language = 'en') => {
  if (!paymentStatus || !PAYMENT_STATUS_DISPLAY[paymentStatus]) return paymentStatus || '-';
  return language === 'tr' ? PAYMENT_STATUS_DISPLAY[paymentStatus].tr : PAYMENT_STATUS_DISPLAY[paymentStatus].en;
}; 