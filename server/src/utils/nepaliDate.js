/**
 * Nepali Date (Bikram Sambat) and Devanagari Number Utilities
 */

const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const nepaliMonths = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

export const nepaliMonthsShort = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कात्तिक', 'मंसीर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

// Approximate BS reference anchor: 2026-08-22 A.D. is approx 2083-05-06 B.S. (Bhadra 6, 2083)
// Standard AD -> BS offset ~ 56.7 years (~56 years, 8 months, 17 days)
export const toDevanagariDigits = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)]);
};

export const fromDevanagariDigits = (str) => {
  if (!str) return '';
  return str.split('').map(ch => {
    const idx = nepaliDigits.indexOf(ch);
    return idx !== -1 ? idx : ch;
  }).join('');
};

/**
 * Format current or provided date to Bikram Sambat string (YYYY-MM-DD or YYYY/MM/DD)
 */
export const getNepaliDate = (date = new Date()) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Approximate BS year & date for Nepal cooperative context
  const adYear = d.getFullYear();
  const adMonth = d.getMonth() + 1;
  const adDay = d.getDate();

  // Basic robust calendar map for modern years
  let bsYear = adYear + 56;
  let bsMonth = adMonth + 8;
  let bsDay = adDay + 17;

  if (bsDay > 30) {
    bsDay -= 30;
    bsMonth += 1;
  }
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear += 1;
  }

  const pad = (n) => String(n).padStart(2, '0');
  return {
    formatted: `${bsYear}-${pad(bsMonth)}-${pad(bsDay)}`,
    formattedDevanagari: `${toDevanagariDigits(bsYear)}/${toDevanagariDigits(pad(bsMonth))}/${toDevanagariDigits(pad(bsDay))}`,
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    monthName: nepaliMonths[bsMonth - 1] || '',
    fullText: `${toDevanagariDigits(bsYear)} ${nepaliMonths[bsMonth - 1]} ${toDevanagariDigits(bsDay)} गते`
  };
};

export const formatCurrencyNepali = (amount) => {
  const num = Number(amount) || 0;
  return `रु. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatCurrencyDevanagari = (amount) => {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return `रु. ${toDevanagariDigits(formatted)}`;
};
