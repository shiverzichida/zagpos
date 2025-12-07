export const formatCurrency = (amount: number, currency = 'IDR') => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  // Adjust fraction digits for currencies that use cents
  if (['USD', 'EUR', 'GBP'].includes(currency)) {
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  }

  try {
    return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', options).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
};

export const SUPPORTED_CURRENCIES = [
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];
