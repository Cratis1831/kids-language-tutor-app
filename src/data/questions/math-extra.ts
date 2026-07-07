import type { Question } from '../../types';
import { questionFactory, num } from './_compact';
import { frNumber, enNumber } from './_numbers';

// 80 additional math questions (ids math-21 … math-100), generated from fixed
// number pairs so ids and content stay stable across sessions. 40 easy / 40 hard.

const { mc } = questionFactory('math');
const qs: Question[] = [];

// --- Easy: additions within 10 (10) ---
for (const [a, b] of [[1, 2], [2, 2], [3, 2], [4, 3], [5, 2], [2, 6], [4, 4], [3, 5], [7, 2], [6, 3]]) {
  const s = a + b;
  qs.push(mc('easy', `Combien font ${a} + ${b} ?`, `What is ${a} + ${b}?`, num(s), [num(s + 1), num(s - 1)]));
}

// --- Easy: subtractions within 10 (10) ---
for (const [a, b] of [[9, 3], [8, 2], [7, 4], [10, 6], [6, 2], [9, 5], [8, 5], [5, 4], [7, 3], [10, 2]]) {
  const d = a - b;
  qs.push(mc('easy', `Combien font ${a} - ${b} ?`, `What is ${a} - ${b}?`, num(d), [num(d + 1), num(d + 2)]));
}

// --- Easy: number after / before (10) ---
for (const x of [3, 6, 9, 12, 14]) {
  qs.push(mc('easy', `Quel nombre vient après ${frNumber(x)} ?`, `Which number comes after ${enNumber(x)}?`, num(x + 1), [num(x - 1), num(x + 2)]));
}
for (const x of [4, 7, 10, 13, 15]) {
  qs.push(mc('easy', `Quel nombre vient avant ${frNumber(x)} ?`, `Which number comes before ${enNumber(x)}?`, num(x - 1), [num(x + 1), num(x - 2)]));
}

// --- Easy: biggest / smallest of three (10) ---
for (const [big, m, s] of [[8, 5, 2], [9, 4, 3], [7, 6, 1], [10, 5, 3], [9, 8, 2]]) {
  qs.push(mc('easy', 'Quel nombre est le plus grand ?', 'Which number is the biggest?', num(big), [num(m), num(s)]));
}
for (const [small, m, b] of [[1, 4, 7], [2, 6, 9], [3, 5, 8], [2, 7, 10], [4, 6, 9]]) {
  qs.push(mc('easy', 'Quel nombre est le plus petit ?', 'Which number is the smallest?', num(small), [num(m), num(b)]));
}

// --- Hard: two-digit additions (10) ---
for (const [a, b] of [[12, 15], [23, 14], [31, 25], [42, 17], [26, 33], [15, 35], [24, 38], [45, 27], [36, 19], [52, 28]]) {
  const s = a + b;
  qs.push(mc('hard', `Combien font ${a} + ${b} ?`, `What is ${a} + ${b}?`, num(s), [num(s + 1), num(s - 2)]));
}

// --- Hard: two-digit subtractions (10) ---
for (const [a, b] of [[40, 15], [50, 22], [35, 18], [60, 25], [45, 17], [70, 30], [55, 28], [80, 35], [65, 40], [90, 45]]) {
  const d = a - b;
  qs.push(mc('hard', `Combien font ${a} - ${b} ?`, `What is ${a} - ${b}?`, num(d), [num(d + 2), num(d - 1)]));
}

// --- Hard: multiplication tables (10) ---
for (const [a, b] of [[3, 4], [4, 5], [6, 7], [7, 8], [8, 3], [9, 4], [5, 5], [6, 6], [7, 3], [8, 4]]) {
  const p = a * b;
  qs.push(mc('hard', `Combien font ${a} × ${b} ?`, `What is ${a} × ${b}?`, num(p), [num(p + a), num(p - b)]));
}

// --- Hard: divisions (10) ---
for (const [a, b] of [[12, 3], [20, 5], [18, 6], [24, 4], [30, 5], [16, 2], [27, 3], [36, 6], [40, 8], [45, 9]]) {
  const q = a / b;
  qs.push(mc('hard', `Combien font ${a} ÷ ${b} ?`, `What is ${a} ÷ ${b}?`, num(q), [num(q + 1), num(q - 1)]));
}

export const mathExtraQuestions: Question[] = qs;
