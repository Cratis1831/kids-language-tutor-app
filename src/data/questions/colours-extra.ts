import type { Question } from '../../types';
import { questionFactory, type Opt } from './_compact';

// 80 additional colour questions (ids colours-21 … colours-100). 40 easy / 40 hard.

const { mc, tf } = questionFactory('colours');
const qs: Question[] = [];

const C: Record<string, Opt> = {
  rouge: ['Rouge', 'Red'], jaune: ['Jaune', 'Yellow'], orange: ['Orange', 'Orange'],
  vert: ['Vert', 'Green'], bleu: ['Bleu', 'Blue'], violet: ['Violet', 'Purple'],
  rose: ['Rose', 'Pink'], blanc: ['Blanc', 'White'], noir: ['Noir', 'Black'],
  gris: ['Gris', 'Grey'], brun: ['Brun', 'Brown'],
};

// --- Easy: what colour is this thing? (20) ---
const objects: [string, string, string, string, string][] = [
  // [French object phrase, English object phrase, correct, wrong1, wrong2]
  ['une tomate', 'a tomato', 'rouge', 'bleu', 'violet'],
  ['un citron', 'a lemon', 'jaune', 'rose', 'gris'],
  ['une carotte', 'a carrot', 'orange', 'bleu', 'noir'],
  ['une aubergine', 'an eggplant', 'violet', 'jaune', 'orange'],
  ['la laitue', 'lettuce', 'vert', 'rouge', 'violet'],
  ['la craie', 'chalk', 'blanc', 'noir', 'vert'],
  ['le charbon', 'coal', 'noir', 'blanc', 'rose'],
  ['une myrtille', 'a blueberry', 'bleu', 'rouge', 'jaune'],
  ['une cerise', 'a cherry', 'rouge', 'vert', 'bleu'],
  ['le maïs', 'corn', 'jaune', 'violet', 'bleu'],
  ['une citrouille', 'a pumpkin', 'orange', 'gris', 'bleu'],
  ['une prune', 'a plum', 'violet', 'orange', 'blanc'],
  ['un concombre', 'a cucumber', 'vert', 'rose', 'noir'],
  ['un bonhomme de neige', 'a snowman', 'blanc', 'rouge', 'vert'],
  ['un pneu', 'a tire', 'noir', 'jaune', 'rose'],
  ['un jean', 'a pair of jeans', 'bleu', 'orange', 'vert'],
  ['un canard en plastique', 'a rubber duck', 'jaune', 'noir', 'gris'],
  ['un sapin', 'a fir tree', 'vert', 'violet', 'rose'],
  ['une feuille de papier', 'a sheet of paper', 'blanc', 'noir', 'brun'],
  ['un ourson en peluche', 'a teddy bear', 'brun', 'bleu', 'vert'],
];
for (const [fr, en, ok, w1, w2] of objects) {
  qs.push(mc('easy', `De quelle couleur est ${fr} ?`, `What colour is ${en}?`, C[ok], [C[w1], C[w2]]));
}

// --- Easy: animal colours (8) ---
const animals: [string, string, string, string, string][] = [
  ['un flamant rose', 'a flamingo', 'rose', 'vert', 'noir'],
  ['une grenouille', 'a frog', 'vert', 'violet', 'rose'],
  ['une coccinelle', 'a ladybug', 'rouge', 'bleu', 'gris'],
  ['un ours polaire', 'a polar bear', 'blanc', 'noir', 'orange'],
  ['un corbeau', 'a crow', 'noir', 'blanc', 'rose'],
  ['un canari', 'a canary', 'jaune', 'bleu', 'gris'],
  ['un poisson rouge', 'a goldfish', 'orange', 'vert', 'violet'],
  ['un éléphant', 'an elephant', 'gris', 'rose', 'vert'],
];
for (const [fr, en, ok, w1, w2] of animals) {
  qs.push(mc('easy', `De quelle couleur est ${fr} ?`, `What colour is ${en}?`, C[ok], [C[w1], C[w2]]));
}

// --- Easy: true/false (6) ---
qs.push(
  tf('easy', 'Le lait est blanc.', 'Milk is white.', true),
  tf('easy', 'Les bananes sont bleues.', 'Bananas are blue.', false),
  tf('easy', 'Les fraises sont vertes.', 'Strawberries are green.', false),
  tf('easy', 'Le ciel de nuit est noir.', 'The night sky is black.', true),
  tf('easy', 'Les oranges sont orange.', 'Oranges are orange.', true),
  tf('easy', 'L’herbe est violette.', 'Grass is purple.', false),
);

// --- Easy: find the thing of this colour (6) ---
qs.push(
  mc('easy', 'Lequel est jaune ?', 'Which one is yellow?', ['La banane', 'The banana'], [['La tomate', 'The tomato'], ['La laitue', 'The lettuce']]),
  mc('easy', 'Lequel est rouge ?', 'Which one is red?', ['La fraise', 'The strawberry'], [['Le citron', 'The lemon'], ['Le concombre', 'The cucumber']]),
  mc('easy', 'Lequel est vert ?', 'Which one is green?', ['Le brocoli', 'The broccoli'], [['La cerise', 'The cherry'], ['La neige', 'The snow']]),
  mc('easy', 'Laquelle est orange ?', 'Which one is orange?', ['L’orange', 'The orange'], [['La myrtille', 'The blueberry'], ['La craie', 'The chalk']]),
  mc('easy', 'Laquelle est violette ?', 'Which one is purple?', ['L’aubergine', 'The eggplant'], [['La carotte', 'The carrot'], ['Le maïs', 'The corn']]),
  mc('easy', 'Laquelle est bleue ?', 'Which one is blue?', ['La myrtille', 'The blueberry'], [['La tomate', 'The tomato'], ['La citrouille', 'The pumpkin']]),
);

// --- Hard: colour mixing (8) ---
qs.push(
  mc('hard', 'Quelle couleur obtient-on en mélangeant le noir et le blanc ?', 'What colour do you get by mixing black and white?', C.gris, [C.brun, C.violet]),
  mc('hard', 'Quelle couleur obtient-on en mélangeant le bleu et le blanc ?', 'What colour do you get by mixing blue and white?', ['Bleu clair', 'Light blue'], [['Bleu foncé', 'Dark blue'], ['Vert', 'Green']]),
  mc('hard', 'Quelle couleur faut-il ajouter au rouge pour faire du rose ?', 'Which colour do you add to red to make pink?', C.blanc, [C.noir, C.vert]),
  mc('hard', 'Pour faire du vert, on mélange le jaune et…', 'To make green, you mix yellow and…', ['Le bleu', 'Blue'], [['Le rouge', 'Red'], ['Le rose', 'Pink']]),
  mc('hard', 'Quelles couleurs font le violet ?', 'Which colours make purple?', ['Le rouge et le bleu', 'Red and blue'], [['Le jaune et le vert', 'Yellow and green'], ['Le blanc et le noir', 'White and black']]),
  mc('hard', 'Quelles couleurs font le vert ?', 'Which colours make green?', ['Le bleu et le jaune', 'Blue and yellow'], [['Le rouge et le blanc', 'Red and white'], ['Le noir et le rose', 'Black and pink']]),
  mc('hard', 'Plus on ajoute de blanc à une couleur, plus elle devient…', 'The more white you add to a colour, the more it becomes…', ['Claire', 'Lighter'], [['Foncée', 'Darker'], ['Brillante', 'Shinier']]),
  mc('hard', 'Plus on ajoute de noir à une couleur, plus elle devient…', 'The more black you add to a colour, the more it becomes…', ['Foncée', 'Darker'], [['Claire', 'Lighter'], ['Transparente', 'See-through']]),
);

// --- Hard: the rainbow (5) ---
qs.push(
  mc('hard', 'Quelle est la première couleur de l’arc-en-ciel ?', 'What is the first colour of the rainbow?', C.rouge, [C.violet, C.vert]),
  mc('hard', 'Quelle est la dernière couleur de l’arc-en-ciel ?', 'What is the last colour of the rainbow?', C.violet, [C.rouge, C.jaune]),
  mc('hard', 'Dans l’arc-en-ciel, quelle couleur est entre le jaune et le bleu ?', 'In the rainbow, which colour is between yellow and blue?', C.vert, [C.rose, C.brun]),
  mc('hard', 'Dans l’arc-en-ciel, quelle couleur vient après le rouge ?', 'In the rainbow, which colour comes after red?', C.orange, [C.bleu, C.violet]),
  tf('hard', 'Le violet est une couleur de l’arc-en-ciel.', 'Purple is a colour of the rainbow.', true),
);

// --- Hard: colour vocabulary (8) ---
qs.push(
  mc('hard', 'Que veut dire « doré » ?', 'What does «doré» (golden) mean?', ['De la couleur de l’or', 'The colour of gold'], [['De la couleur de l’herbe', 'The colour of grass'], ['De la couleur du ciel', 'The colour of the sky']]),
  mc('hard', 'Que veut dire « argenté » ?', 'What does «argenté» (silvery) mean?', ['De la couleur de l’argent', 'The colour of silver'], [['De la couleur du feu', 'The colour of fire'], ['De la couleur de la forêt', 'The colour of the forest']]),
  mc('hard', 'Le bleu marine est un bleu…', 'Navy blue is a blue that is…', ['Très foncé', 'Very dark'], [['Très clair', 'Very light'], ['Presque vert', 'Almost green']]),
  mc('hard', 'Le bleu ciel est un bleu…', 'Sky blue is a blue that is…', ['Très clair', 'Very light'], [['Très foncé', 'Very dark'], ['Presque noir', 'Almost black']]),
  mc('hard', 'La couleur turquoise ressemble à…', 'The colour turquoise looks like…', ['Un bleu-vert', 'A blue-green'], [['Un rouge foncé', 'A dark red'], ['Un jaune pâle', 'A pale yellow']]),
  mc('hard', 'La couleur bordeaux ressemble à…', 'The colour burgundy looks like…', ['Un rouge foncé', 'A dark red'], [['Un vert clair', 'A light green'], ['Un bleu vif', 'A bright blue']]),
  mc('hard', 'La couleur beige ressemble à…', 'The colour beige looks like…', ['Un brun très clair', 'A very light brown'], [['Un noir profond', 'A deep black'], ['Un rose vif', 'A bright pink']]),
  tf('hard', '« Écarlate » est un rouge vif.', '«Écarlate» (scarlet) is a bright red.', true),
);

// --- Hard: warm and cool colours (5) ---
qs.push(
  mc('hard', 'Le rouge est une couleur…', 'Red is a … colour.', ['Chaude', 'Warm'], [['Froide', 'Cool'], ['Invisible', 'Invisible']]),
  mc('hard', 'Le bleu est une couleur…', 'Blue is a … colour.', ['Froide', 'Cool'], [['Chaude', 'Warm'], ['Bruyante', 'Noisy']]),
  mc('hard', 'L’orange est une couleur…', 'Orange is a … colour.', ['Chaude', 'Warm'], [['Froide', 'Cool'], ['Salée', 'Salty']]),
  tf('hard', 'Le jaune est une couleur chaude.', 'Yellow is a warm colour.', true),
  mc('hard', 'Laquelle est une couleur froide ?', 'Which one is a cool colour?', C.bleu, [C.rouge, C.orange]),
);

// --- Hard: true/false (6) ---
qs.push(
  tf('hard', 'Mélanger le rouge et le bleu donne du vert.', 'Mixing red and blue makes green.', false),
  tf('hard', 'Le blanc rend les couleurs plus foncées.', 'White makes colours darker.', false),
  tf('hard', 'Les feux de circulation ont une lumière bleue.', 'Traffic lights have a blue light.', false),
  tf('hard', 'Le drapeau du Canada est rouge et blanc.', 'The flag of Canada is red and white.', true),
  tf('hard', 'Le drapeau de la France a trois couleurs.', 'The flag of France has three colours.', true),
  tf('hard', 'L’or est argenté.', 'Gold is silvery.', false),
);

// --- Hard: flags and lights (8) ---
qs.push(
  mc('hard', 'Quelles sont les couleurs du drapeau de la France ?', 'What are the colours of the French flag?', ['Bleu, blanc et rouge', 'Blue, white and red'], [['Vert, jaune et noir', 'Green, yellow and black'], ['Rose, gris et brun', 'Pink, grey and brown']]),
  mc('hard', 'Quelle couleur du feu de circulation veut dire « arrête-toi » ?', 'Which traffic light colour means "stop"?', C.rouge, [C.vert, C.jaune]),
  mc('hard', 'Quelle couleur du feu de circulation veut dire « avance » ?', 'Which traffic light colour means "go"?', C.vert, [C.rouge, C.jaune]),
  mc('hard', 'Quelle couleur du feu de circulation veut dire « attention » ?', 'Which traffic light colour means "caution"?', C.jaune, [C.vert, C.bleu]),
  mc('hard', 'Quel symbole rouge est sur le drapeau du Canada ?', 'What red symbol is on the flag of Canada?', ['Une feuille d’érable', 'A maple leaf'], [['Une étoile', 'A star'], ['Un soleil', 'A sun']]),
  mc('hard', 'De quelle couleur est un panneau d’arrêt ?', 'What colour is a stop sign?', C.rouge, [C.bleu, C.vert]),
  mc('hard', 'De quelle couleur sont les autobus scolaires ?', 'What colour are school buses?', C.jaune, [C.violet, C.blanc]),
  mc('hard', 'De quelles couleurs est le drapeau du Québec ?', 'What colours is the flag of Quebec?', ['Bleu et blanc', 'Blue and white'], [['Rouge et noir', 'Red and black'], ['Vert et jaune', 'Green and yellow']]),
);

export const coloursExtraQuestions: Question[] = qs;
