import type { Question } from '../../types';
import { questionFactory, digits, type Opt } from './_compact';

// 80 additional measurement questions (ids measurements-21 … measurements-100).
// 40 easy / 40 hard.

const { mc, tf } = questionFactory('measurements');
const qs: Question[] = [];

// --- Easy: which is the longest? (8) ---
const longest: [Opt, Opt, Opt][] = [
  [['Un autobus', 'A bus'], ['Une voiture', 'A car'], ['Un vélo', 'A bicycle']],
  [['Un serpent', 'A snake'], ['Un lézard', 'A lizard'], ['Un escargot', 'A snail']],
  [['Une rivière', 'A river'], ['Une piscine', 'A swimming pool'], ['Une flaque', 'A puddle']],
  [['Une corde à sauter', 'A skipping rope'], ['Un lacet', 'A shoelace'], ['Un trombone', 'A paperclip']],
  [['Une baleine', 'A whale'], ['Un dauphin', 'A dolphin'], ['Un poisson rouge', 'A goldfish']],
  [['Un train', 'A train'], ['Un camion', 'A truck'], ['Une trottinette', 'A scooter']],
  [['Une autoroute', 'A highway'], ['Une rue', 'A street'], ['Un trottoir', 'A sidewalk']],
  [['Un crocodile', 'A crocodile'], ['Un chien', 'A dog'], ['Une souris', 'A mouse']],
];
for (const [a, b, c] of longest) {
  qs.push(mc('easy', 'Quel est le plus long ?', 'Which is the longest?', a, [b, c]));
}

// --- Easy: which is the heaviest? (8) ---
const heaviest: [Opt, Opt, Opt][] = [
  [['Un hippopotame', 'A hippo'], ['Un chien', 'A dog'], ['Un hamster', 'A hamster']],
  [['Un réfrigérateur', 'A fridge'], ['Une chaise', 'A chair'], ['Un coussin', 'A cushion']],
  [['Une roche', 'A rock'], ['Une éponge', 'A sponge'], ['Un ballon de plage', 'A beach ball']],
  [['Un camion', 'A truck'], ['Un vélo', 'A bicycle'], ['Une trottinette', 'A scooter']],
  [['Une vache', 'A cow'], ['Une poule', 'A hen'], ['Une souris', 'A mouse']],
  [['Une ancre', 'An anchor'], ['Une bouée', 'A float'], ['Une bulle', 'A bubble']],
  [['Une pastèque', 'A watermelon'], ['Une pomme', 'An apple'], ['Un raisin', 'A grape']],
  [['Un ours', 'A bear'], ['Un renard', 'A fox'], ['Un écureuil', 'A squirrel']],
];
for (const [a, b, c] of heaviest) {
  qs.push(mc('easy', 'Quel est le plus lourd ?', 'Which is the heaviest?', a, [b, c]));
}

// --- Easy: which is the tallest? (6) ---
const tallest: [Opt, Opt, Opt][] = [
  [['Une girafe', 'A giraffe'], ['Un cheval', 'A horse'], ['Un mouton', 'A sheep']],
  [['Un gratte-ciel', 'A skyscraper'], ['Une maison', 'A house'], ['Une tente', 'A tent']],
  [['Un arbre', 'A tree'], ['Un buisson', 'A bush'], ['Une fleur', 'A flower']],
  [['Un phare', 'A lighthouse'], ['Une cabane', 'A cabin'], ['Une niche', 'A doghouse']],
  [['Une tour', 'A tower'], ['Une école', 'A school'], ['Un banc', 'A bench']],
  [['Un adulte', 'An adult'], ['Un enfant', 'A child'], ['Un bébé', 'A baby']],
];
for (const [a, b, c] of tallest) {
  qs.push(mc('easy', 'Quel est le plus grand ?', 'Which is the tallest?', a, [b, c]));
}

// --- Easy: measuring tools (6) ---
qs.push(
  mc('easy', 'Avec quoi mesure-t-on le poids ?', 'What do we use to measure weight?',
    ['Une balance', 'A scale'], [['Une règle', 'A ruler'], ['Une horloge', 'A clock']]),
  mc('easy', 'Avec quoi mesure-t-on le temps d’une course ?', 'What do we use to time a race?',
    ['Un chronomètre', 'A stopwatch'], [['Une balance', 'A scale'], ['Un thermomètre', 'A thermometer']]),
  mc('easy', 'Avec quoi mesure-t-on la hauteur d’un mur ?', 'What do we use to measure the height of a wall?',
    ['Un mètre ruban', 'A tape measure'], [['Une cuillère', 'A spoon'], ['Une balance', 'A scale']]),
  mc('easy', 'Quel objet te dit l’heure ?', 'Which object tells you the time?',
    ['Une horloge', 'A clock'], [['Une règle', 'A ruler'], ['Une balance', 'A scale']]),
  mc('easy', 'Avec quoi mesure-t-on la fièvre ?', 'What do we use to check a fever?',
    ['Un thermomètre', 'A thermometer'], [['Un chronomètre', 'A stopwatch'], ['Un mètre ruban', 'A tape measure']]),
  mc('easy', 'Avec quoi mesure-t-on la farine pour un gâteau ?', 'What do we use to measure flour for a cake?',
    ['Une tasse à mesurer', 'A measuring cup'], [['Une horloge', 'A clock'], ['Une règle', 'A ruler']]),
);

// --- Easy: true/false comparisons (6) ---
qs.push(
  tf('easy', 'Une minute est plus courte qu’une heure.', 'A minute is shorter than an hour.', true),
  tf('easy', 'Un éléphant est plus léger qu’une souris.', 'An elephant is lighter than a mouse.', false),
  tf('easy', 'L’été est plus chaud que l’hiver.', 'Summer is hotter than winter.', true),
  tf('easy', 'Un centimètre est plus long qu’un mètre.', 'A centimetre is longer than a metre.', false),
  tf('easy', 'La nuit, il fait plus sombre que le jour.', 'It is darker at night than during the day.', true),
  tf('easy', 'Une semaine a dix jours.', 'A week has ten days.', false),
);

// --- Easy: fastest / slowest (6) ---
qs.push(
  mc('easy', 'Quel est le plus rapide ?', 'Which is the fastest?',
    ['Un avion', 'An airplane'], [['Une voiture', 'A car'], ['Un vélo', 'A bicycle']]),
  mc('easy', 'Quel animal est le plus rapide ?', 'Which animal is the fastest?',
    ['Un guépard', 'A cheetah'], [['Une tortue', 'A turtle'], ['Un escargot', 'A snail']]),
  mc('easy', 'Quel est le plus rapide ?', 'Which is the fastest?',
    ['Une fusée', 'A rocket'], [['Un avion', 'An airplane'], ['Une montgolfière', 'A hot-air balloon']]),
  mc('easy', 'Quel animal est le plus lent ?', 'Which animal is the slowest?',
    ['Un escargot', 'A snail'], [['Un lapin', 'A rabbit'], ['Un cheval', 'A horse']]),
  mc('easy', 'Quel est le plus rapide ?', 'Which is the fastest?',
    ['Un train', 'A train'], [['Un autobus', 'A bus'], ['Un piéton', 'A pedestrian']]),
  mc('easy', 'Quel animal est le plus lent ?', 'Which animal is the slowest?',
    ['Une tortue', 'A turtle'], [['Un chien', 'A dog'], ['Un oiseau', 'A bird']]),
);

// --- Hard: generated unit conversions (16) ---
for (const h of [2, 3, 4, 5]) {
  qs.push(mc('hard', `Combien de minutes y a-t-il dans ${h} heures ?`, `How many minutes are in ${h} hours?`,
    digits(h * 60), [digits(h * 60 + 10), digits(h * 60 - 10)]));
}
for (const w of [2, 3, 4]) {
  qs.push(mc('hard', `Combien de jours y a-t-il dans ${w} semaines ?`, `How many days are in ${w} weeks?`,
    digits(w * 7), [digits(w * 7 + 2), digits(w * 7 - 2)]));
}
for (const d of [2, 3]) {
  qs.push(mc('hard', `Combien d’heures y a-t-il dans ${d} jours ?`, `How many hours are in ${d} days?`,
    digits(d * 24), [digits(d * 24 + 2), digits(d * 24 - 2)]));
}
for (const m of [2, 3, 5]) {
  qs.push(mc('hard', `Combien de centimètres y a-t-il dans ${m} mètres ?`, `How many centimetres are in ${m} metres?`,
    digits(m * 100), [digits(m * 100 + 10), digits(m * 100 - 10)]));
}
for (const m of [2, 3]) {
  qs.push(mc('hard', `Combien de secondes y a-t-il dans ${m} minutes ?`, `How many seconds are in ${m} minutes?`,
    digits(m * 60), [digits(m * 60 + 10), digits(m * 60 - 10)]));
}
qs.push(
  mc('hard', 'Combien de grammes y a-t-il dans un kilogramme ?', 'How many grams are in one kilogram?',
    digits(1000), [digits(100), digits(500)]),
  mc('hard', 'Combien de millilitres y a-t-il dans un litre ?', 'How many millilitres are in one litre?',
    digits(1000), [digits(100), digits(10)]),
);

// --- Hard: days of the week, before/after (9) ---
const DAYS: Opt[] = [
  ['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'], ['jeudi', 'Thursday'],
  ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday'],
];
for (const i of [0, 2, 4, 6, 3, 5]) {
  const next = DAYS[(i + 1) % 7];
  const wrong1 = DAYS[(i + 3) % 7];
  const wrong2 = DAYS[(i + 5) % 7];
  qs.push(mc('hard', `Quel jour vient après ${DAYS[i][0]} ?`, `Which day comes after ${DAYS[i][1]}?`, next, [wrong1, wrong2]));
}
for (const i of [1, 3, 6]) {
  const prev = DAYS[(i + 6) % 7];
  qs.push(mc('hard', `Quel jour vient avant ${DAYS[i][0]} ?`, `Which day comes before ${DAYS[i][1]}?`, prev, [DAYS[(i + 2) % 7], DAYS[(i + 4) % 7]]));
}

// --- Hard: months, before/after (6) ---
const MONTHS: Opt[] = [
  ['janvier', 'January'], ['février', 'February'], ['mars', 'March'], ['avril', 'April'],
  ['mai', 'May'], ['juin', 'June'], ['juillet', 'July'], ['août', 'August'],
  ['septembre', 'September'], ['octobre', 'October'], ['novembre', 'November'], ['décembre', 'December'],
];
for (const i of [0, 2, 5, 7, 9, 11]) {
  const next = MONTHS[(i + 1) % 12];
  qs.push(mc('hard', `Quel mois vient après ${MONTHS[i][0]} ?`, `Which month comes after ${MONTHS[i][1]}?`, next, [MONTHS[(i + 4) % 12], MONTHS[(i + 7) % 12]]));
}

// --- Hard: which unit to use (5) ---
qs.push(
  mc('hard', 'Quelle unité utilise-t-on pour la distance entre deux villes ?', 'Which unit do we use for the distance between two cities?',
    ['Le kilomètre', 'The kilometre'], [['Le centimètre', 'The centimetre'], ['Le gramme', 'The gram']]),
  mc('hard', 'Quelle unité utilise-t-on pour la longueur d’un crayon ?', 'Which unit do we use for the length of a pencil?',
    ['Le centimètre', 'The centimetre'], [['Le kilomètre', 'The kilometre'], ['Le litre', 'The litre']]),
  mc('hard', 'Quelle unité utilise-t-on pour le poids d’une pomme ?', 'Which unit do we use for the weight of an apple?',
    ['Le gramme', 'The gram'], [['Le mètre', 'The metre'], ['La minute', 'The minute']]),
  mc('hard', 'Quelle unité utilise-t-on pour l’eau d’une baignoire ?', 'Which unit do we use for the water in a bathtub?',
    ['Le litre', 'The litre'], [['Le gramme', 'The gram'], ['Le centimètre', 'The centimetre']]),
  mc('hard', 'Quelle unité utilise-t-on pour la durée d’une chanson ?', 'Which unit do we use for the length of a song?',
    ['La minute', 'The minute'], [['Le kilogramme', 'The kilogram'], ['Le mètre', 'The metre']]),
);

// --- Hard: true/false (4) ---
qs.push(
  tf('hard', 'Une année a 365 jours.', 'A year has 365 days.', true),
  tf('hard', 'Un kilogramme de plumes pèse autant qu’un kilogramme de roches.', 'A kilogram of feathers weighs the same as a kilogram of rocks.', true),
  tf('hard', 'Midi, c’est 12 heures.', 'Noon is 12 o’clock.', true),
  tf('hard', 'Il y a cinq saisons dans une année.', 'There are five seasons in a year.', false),
);

export const measurementsExtraQuestions: Question[] = qs;
