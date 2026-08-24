/**
 * Number to Nepali Words Converter
 * Converts numeric currency amounts to formal Nepali text for invoices (अक्षरेपी रु.)
 */

const ones = [
  '', 'एक', 'दुई', 'तीन', 'चार', 'पाँच', 'छ', 'सात', 'आठ', 'नौ',
  'दश', 'एघार', 'बाह्र', 'तेह्र', 'चौध', 'पन्ध्र', 'सोह्र', 'सत्र', 'अठार', 'उन्नाइस',
  'बीस', 'एक्काइस', 'बाइस', 'तेइस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताइस', 'अठ्ठाइस', 'उनन्तिस',
  'तीस', 'एकत्तिस', 'बत्तिस', 'तेत्तिस', 'चौँतिस', 'पैँतिस', 'छत्तीस', 'सैँतिस', 'अड्तीस', 'उनन्चालीस',
  'चालीस', 'एकचालीस', 'बयालीस', 'त्रिचालीस', 'चवालीस', 'पैँतालीस', 'छयालीस', 'सत्चालीस', 'अठ्चालीस', 'उनन्चास',
  'पचास', 'एक्काउन्न', 'बाउन्न', 'त्रिपन्न', 'चौपन्न', 'पचपन्न', 'छपन्न', 'सन्ताउन्न', 'अन्ठाउन्न', 'उनन्साठी',
  'साठी', 'एकसट्ठी', 'बासट्ठी', 'त्रिसट्ठी', 'चौसट्ठी', 'पैँसट्ठी', 'छैसट्ठी', 'सत्सट्ठी', 'अठ्सट्ठी', 'उनन्सत्तरी',
  'सत्तरी', 'एकहत्तर', 'बहत्तर', 'त्रिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छयहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी',
  'असी', 'एकासी', 'बयासी', 'त्रियासी', 'चौरासी', 'पचासी', 'छयासी', 'सतासी', 'अठासी', 'उनान्नब्बे',
  'नब्बे', 'एकान्नब्बे', 'बयानब्बे', 'त्रियान्नब्बे', 'चौरान्नब्बे', 'पन्चान्नब्बे', 'छयान्नब्बे', 'सन्तान्नब्बे', 'अन्ठान्नब्बे', 'उनन्सय'
];

export const numberToNepaliWords = (number) => {
  if (number === 0 || number === '0') return 'शून्य रुपैयाँ मात्र';
  if (!number) return '';

  const num = Math.floor(Math.abs(Number(number)));
  if (isNaN(num)) return '';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = Math.floor(num % 100);

  const parts = [];

  if (crore > 0) {
    parts.push(`${ones[crore] || crore} करोड`);
  }
  if (lakh > 0) {
    parts.push(`${ones[lakh] || lakh} लाख`);
  }
  if (thousand > 0) {
    parts.push(`${ones[thousand] || thousand} हजार`);
  }
  if (hundred > 0) {
    parts.push(`${ones[hundred] || hundred} सय`);
  }
  if (rest > 0) {
    parts.push(ones[rest]);
  }

  const words = parts.join(' ').trim();
  return words ? `${words} रुपैयाँ मात्र` : 'शून्य रुपैयाँ मात्र';
};

export default numberToNepaliWords;
