// Number-to-words helpers used to generate math questions with correct
// French (including the soixante-dix / quatre-vingts irregularities).

const FR_UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf',
];

export function frNumber(n: number): string {
  if (n < 0 || n > 100) return String(n);
  if (n < 20) return FR_UNITS[n];
  if (n === 100) return 'cent';
  if (n < 70) {
    const tens = ['vingt', 'trente', 'quarante', 'cinquante', 'soixante'][Math.floor(n / 10) - 2];
    const u = n % 10;
    if (u === 0) return tens;
    if (u === 1) return `${tens} et un`;
    return `${tens}-${FR_UNITS[u]}`;
  }
  if (n < 80) {
    if (n === 71) return 'soixante et onze';
    return `soixante-${FR_UNITS[n - 60]}`;
  }
  const u = n - 80;
  if (u === 0) return 'quatre-vingts';
  return `quatre-vingt-${FR_UNITS[u]}`;
}

const EN_UNITS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function enNumber(n: number): string {
  if (n < 0 || n > 100) return String(n);
  if (n < 20) return EN_UNITS[n];
  if (n === 100) return 'one hundred';
  const u = n % 10;
  const tens = EN_TENS[Math.floor(n / 10)];
  return u === 0 ? tens : `${tens}-${EN_UNITS[u]}`;
}
