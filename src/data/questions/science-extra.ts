import type { Question } from '../../types';
import { questionFactory, type Opt } from './_compact';

// 80 additional science questions (ids science-21 … science-100). 40 easy / 40 hard.

const { mc, tf } = questionFactory('science');
const qs: Question[] = [];

// --- Easy: animal sounds (6) ---
const sounds: [string, string, Opt, Opt, Opt][] = [
  ['« ouaf »', '"woof"', ['Le chien', 'The dog'], ['Le chat', 'The cat'], ['Le poisson', 'The fish']],
  ['« meuh »', '"moo"', ['La vache', 'The cow'], ['Le cheval', 'The horse'], ['La poule', 'The hen']],
  ['« coin-coin »', '"quack"', ['Le canard', 'The duck'], ['Le hibou', 'The owl'], ['La souris', 'The mouse']],
  ['« cocorico »', '"cock-a-doodle-doo"', ['Le coq', 'The rooster'], ['Le canard', 'The duck'], ['Le chat', 'The cat']],
  ['« bêêê »', '"baa"', ['Le mouton', 'The sheep'], ['Le cochon', 'The pig'], ['Le serpent', 'The snake']],
  ['« groin-groin »', '"oink"', ['Le cochon', 'The pig'], ['La vache', 'The cow'], ['Le lapin', 'The rabbit']],
];
for (const [fr, en, a, b, c] of sounds) {
  qs.push(mc('easy', `Quel animal fait ${fr} ?`, `Which animal says ${en}?`, a, [b, c]));
}

// --- Easy: animal babies (6) ---
const babies: [string, string, Opt, Opt, Opt][] = [
  ['du chat', 'cat', ['Le chaton', 'The kitten'], ['Le chiot', 'The puppy'], ['Le poussin', 'The chick']],
  ['du chien', 'dog', ['Le chiot', 'The puppy'], ['Le veau', 'The calf'], ['Le chaton', 'The kitten']],
  ['de la vache', 'cow', ['Le veau', 'The calf'], ['L’agneau', 'The lamb'], ['Le poulain', 'The foal']],
  ['de la poule', 'hen', ['Le poussin', 'The chick'], ['Le chaton', 'The kitten'], ['Le lapereau', 'The baby rabbit']],
  ['du mouton', 'sheep', ['L’agneau', 'The lamb'], ['Le veau', 'The calf'], ['Le chiot', 'The puppy']],
  ['du cheval', 'horse', ['Le poulain', 'The foal'], ['Le veau', 'The calf'], ['Le poussin', 'The chick']],
];
for (const [fr, en, a, b, c] of babies) {
  qs.push(mc('easy', `Comment s’appelle le bébé ${fr} ?`, `What is a baby ${en} called?`, a, [b, c]));
}

// --- Easy: habitats (6) ---
const habitats: [string, string, Opt, Opt, Opt][] = [
  ['Où vivent les abeilles ?', 'Where do bees live?', ['Dans une ruche', 'In a hive'], ['Dans une niche', 'In a doghouse'], ['Dans une étable', 'In a barn']],
  ['Où vit un poisson rouge ?', 'Where does a goldfish live?', ['Dans un aquarium', 'In an aquarium'], ['Dans un nid', 'In a nest'], ['Dans une niche', 'In a doghouse']],
  ['Où dort un chien dehors ?', 'Where does a dog sleep outside?', ['Dans une niche', 'In a doghouse'], ['Dans une ruche', 'In a hive'], ['Dans une écurie', 'In a stable']],
  ['Où vit un cheval ?', 'Where does a horse live?', ['Dans une écurie', 'In a stable'], ['Dans une ruche', 'In a hive'], ['Dans un aquarium', 'In an aquarium']],
  ['Où vit un ours polaire ?', 'Where does a polar bear live?', ['Sur la banquise', 'On the sea ice'], ['Dans le désert', 'In the desert'], ['Dans la jungle', 'In the jungle']],
  ['Où vit un chameau ?', 'Where does a camel live?', ['Dans le désert', 'In the desert'], ['Sur la banquise', 'On the sea ice'], ['Dans l’océan', 'In the ocean']],
];
for (const [fr, en, a, b, c] of habitats) {
  qs.push(mc('easy', fr, en, a, [b, c]));
}

// --- Easy: legs (4) ---
qs.push(
  mc('easy', 'Combien de pattes a un oiseau ?', 'How many legs does a bird have?', ['Deux', 'Two'], [['Quatre', 'Four'], ['Six', 'Six']]),
  mc('easy', 'Combien de pattes a un insecte ?', 'How many legs does an insect have?', ['Six', 'Six'], [['Quatre', 'Four'], ['Huit', 'Eight']]),
  mc('easy', 'Combien de pattes a une vache ?', 'How many legs does a cow have?', ['Quatre', 'Four'], [['Deux', 'Two'], ['Six', 'Six']]),
  tf('easy', 'Les serpents n’ont pas de pattes.', 'Snakes have no legs.', true),
);

// --- Easy: five senses (5) ---
qs.push(
  mc('easy', 'Avec quoi vois-tu ?', 'What do you see with?', ['Les yeux', 'Your eyes'], [['Les oreilles', 'Your ears'], ['Le nez', 'Your nose']]),
  mc('easy', 'Avec quoi entends-tu ?', 'What do you hear with?', ['Les oreilles', 'Your ears'], [['Les yeux', 'Your eyes'], ['Les mains', 'Your hands']]),
  mc('easy', 'Avec quoi sens-tu les odeurs ?', 'What do you smell with?', ['Le nez', 'Your nose'], [['La bouche', 'Your mouth'], ['Les pieds', 'Your feet']]),
  mc('easy', 'Avec quoi goûtes-tu ?', 'What do you taste with?', ['La langue', 'Your tongue'], [['Le nez', 'Your nose'], ['Les oreilles', 'Your ears']]),
  mc('easy', 'Avec quoi touches-tu ?', 'What do you touch with?', ['Les mains', 'Your hands'], [['Les yeux', 'Your eyes'], ['Le nez', 'Your nose']]),
);

// --- Easy: weather & seasons (5) ---
qs.push(
  mc('easy', 'En quelle saison tombe la neige ?', 'In which season does snow fall?', ['En hiver', 'In winter'], [['En été', 'In summer'], ['Au printemps', 'In spring']]),
  mc('easy', 'En quelle saison les feuilles tombent-elles ?', 'In which season do leaves fall?', ['En automne', 'In autumn'], [['En été', 'In summer'], ['Au printemps', 'In spring']]),
  mc('easy', 'Que vois-tu dans le ciel quand il pleut et qu’il y a du soleil ?', 'What do you see in the sky when it rains and the sun shines?', ['Un arc-en-ciel', 'A rainbow'], [['Une étoile filante', 'A shooting star'], ['La lune', 'The moon']]),
  tf('easy', 'Le vent fait bouger les feuilles des arbres.', 'The wind makes tree leaves move.', true),
  mc('easy', 'Quel temps fait-il quand tout est blanc dehors en hiver ?', 'What is the weather when everything is white outside in winter?', ['Il neige', 'It is snowing'], [['Il fait très chaud', 'It is very hot'], ['Il pleut', 'It is raining']]),
);

// --- Easy: plants (4) ---
qs.push(
  mc('easy', 'De quelle couleur sont la plupart des feuilles ?', 'What colour are most leaves?', ['Vertes', 'Green'], [['Bleues', 'Blue'], ['Roses', 'Pink']]),
  mc('easy', 'Qu’est-ce qui pousse sur un pommier ?', 'What grows on an apple tree?', ['Des pommes', 'Apples'], [['Des bananes', 'Bananas'], ['Des carottes', 'Carrots']]),
  tf('easy', 'Les carottes poussent sous la terre.', 'Carrots grow under the ground.', true),
  mc('easy', 'Que faut-il donner à une plante pour l’aider à pousser ?', 'What should you give a plant to help it grow?', ['De l’eau', 'Water'], [['Du jus', 'Juice'], ['Du lait', 'Milk']]),
);

// --- Easy: the body (4) ---
qs.push(
  mc('easy', 'Combien de doigts as-tu sur une main ?', 'How many fingers do you have on one hand?', ['Cinq', 'Five'], [['Quatre', 'Four'], ['Six', 'Six']]),
  mc('easy', 'Avec quoi marches-tu ?', 'What do you walk with?', ['Les jambes', 'Your legs'], [['Les bras', 'Your arms'], ['Les oreilles', 'Your ears']]),
  tf('easy', 'Tu as deux yeux.', 'You have two eyes.', true),
  mc('easy', 'Que fais-tu quand tu as sommeil ?', 'What do you do when you are sleepy?', ['Je dors', 'I sleep'], [['Je cours', 'I run'], ['Je chante', 'I sing']]),
);

// --- Hard: space (8) ---
qs.push(
  mc('hard', 'Combien de planètes y a-t-il dans le système solaire ?', 'How many planets are in the solar system?', ['Huit', 'Eight'], [['Neuf', 'Nine'], ['Sept', 'Seven']]),
  mc('hard', 'Quelle planète est appelée la planète rouge ?', 'Which planet is called the red planet?', ['Mars', 'Mars'], [['Vénus', 'Venus'], ['Jupiter', 'Jupiter']]),
  mc('hard', 'Quelle est l’étoile la plus proche de la Terre ?', 'Which star is closest to Earth?', ['Le Soleil', 'The Sun'], [['La Lune', 'The Moon'], ['Mars', 'Mars']]),
  mc('hard', 'Pourquoi y a-t-il le jour et la nuit ?', 'Why is there day and night?', ['La Terre tourne sur elle-même', 'The Earth spins'], [['Le Soleil s’éteint', 'The Sun turns off'], ['La Lune brille', 'The Moon shines']]),
  mc('hard', 'Comment s’appelle le véhicule qui va dans l’espace ?', 'What is the vehicle that goes to space called?', ['Une fusée', 'A rocket'], [['Un sous-marin', 'A submarine'], ['Un tracteur', 'A tractor']]),
  tf('hard', 'La Lune tourne autour de la Terre.', 'The Moon goes around the Earth.', true),
  tf('hard', 'Le Soleil tourne autour de la Terre.', 'The Sun goes around the Earth.', false),
  mc('hard', 'Quelle est la plus grande planète ?', 'Which is the biggest planet?', ['Jupiter', 'Jupiter'], [['Mercure', 'Mercury'], ['Mars', 'Mars']]),
);

// --- Hard: states of matter (5) ---
qs.push(
  mc('hard', 'Quand l’eau bout, elle devient…', 'When water boils, it becomes…', ['De la vapeur', 'Steam'], [['De la glace', 'Ice'], ['Du sable', 'Sand']]),
  mc('hard', 'Quand la glace chauffe, elle devient…', 'When ice warms up, it becomes…', ['De l’eau', 'Water'], [['Du feu', 'Fire'], ['De la neige', 'Snow']]),
  tf('hard', 'L’eau peut être solide, liquide ou gazeuse.', 'Water can be solid, liquid or gas.', true),
  mc('hard', 'Quel est l’état d’un jus ?', 'What state is juice in?', ['Liquide', 'Liquid'], [['Solide', 'Solid'], ['Gazeux', 'Gas']]),
  mc('hard', 'Quel est l’état d’un caillou ?', 'What state is a pebble in?', ['Solide', 'Solid'], [['Liquide', 'Liquid'], ['Gazeux', 'Gas']]),
);

// --- Hard: animal classes (8) ---
const classes: [string, string, Opt, Opt, Opt][] = [
  ['une baleine', 'a whale', ['Un mammifère', 'A mammal'], ['Un poisson', 'A fish'], ['Un reptile', 'A reptile']],
  ['un serpent', 'a snake', ['Un reptile', 'A reptile'], ['Un insecte', 'An insect'], ['Un oiseau', 'A bird']],
  ['une grenouille', 'a frog', ['Un amphibien', 'An amphibian'], ['Un mammifère', 'A mammal'], ['Un poisson', 'A fish']],
  ['un requin', 'a shark', ['Un poisson', 'A fish'], ['Un mammifère', 'A mammal'], ['Un reptile', 'A reptile']],
  ['un aigle', 'an eagle', ['Un oiseau', 'A bird'], ['Un mammifère', 'A mammal'], ['Un insecte', 'An insect']],
  ['une fourmi', 'an ant', ['Un insecte', 'An insect'], ['Un reptile', 'A reptile'], ['Un oiseau', 'A bird']],
  ['une chauve-souris', 'a bat', ['Un mammifère', 'A mammal'], ['Un oiseau', 'A bird'], ['Un insecte', 'An insect']],
  ['une tortue', 'a turtle', ['Un reptile', 'A reptile'], ['Un amphibien', 'An amphibian'], ['Un mammifère', 'A mammal']],
];
for (const [fr, en, a, b, c] of classes) {
  qs.push(mc('hard', `Quel type d’animal est ${fr} ?`, `What kind of animal is ${en}?`, a, [b, c]));
}

// --- Hard: plants (6) ---
qs.push(
  mc('hard', 'Que transportent les abeilles de fleur en fleur ?', 'What do bees carry from flower to flower?', ['Le pollen', 'Pollen'], [['La terre', 'Soil'], ['Les feuilles', 'Leaves']]),
  mc('hard', 'De quoi sort une plante au début de sa vie ?', 'What does a plant grow from at the start of its life?', ['D’une graine', 'A seed'], [['D’un caillou', 'A pebble'], ['D’une goutte', 'A drop']]),
  mc('hard', 'Quelle partie de l’arbre fabrique la nourriture grâce au soleil ?', 'Which part of the tree makes food using sunlight?', ['Les feuilles', 'The leaves'], [['Le tronc', 'The trunk'], ['Les racines', 'The roots']]),
  tf('hard', 'En automne, les feuilles de certains arbres changent de couleur.', 'In autumn, the leaves of some trees change colour.', true),
  mc('hard', 'Quelle partie de la plante devient le fruit ?', 'Which part of the plant becomes the fruit?', ['La fleur', 'The flower'], [['La racine', 'The root'], ['Le tronc', 'The trunk']]),
  mc('hard', 'Que libèrent les arbres qui nous aide à respirer ?', 'What do trees release that helps us breathe?', ['De l’oxygène', 'Oxygen'], [['Du sable', 'Sand'], ['Du sel', 'Salt']]),
);

// --- Hard: the body (7) ---
qs.push(
  mc('hard', 'Quel organe pompe le sang ?', 'Which organ pumps blood?', ['Le cœur', 'The heart'], [['Le cerveau', 'The brain'], ['L’estomac', 'The stomach']]),
  mc('hard', 'Quel organe te sert à réfléchir ?', 'Which organ do you think with?', ['Le cerveau', 'The brain'], [['Le cœur', 'The heart'], ['Les poumons', 'The lungs']]),
  mc('hard', 'Où va la nourriture après ta bouche ?', 'Where does food go after your mouth?', ['Dans l’estomac', 'To the stomach'], [['Dans les poumons', 'To the lungs'], ['Dans le cœur', 'To the heart']]),
  mc('hard', 'Qu’est-ce qui protège ton cerveau ?', 'What protects your brain?', ['Le crâne', 'The skull'], [['Les côtes', 'The ribs'], ['Les dents', 'The teeth']]),
  tf('hard', 'Les os forment le squelette.', 'Bones make up the skeleton.', true),
  mc('hard', 'Qu’est-ce qui te permet de bouger les bras et les jambes ?', 'What lets you move your arms and legs?', ['Les muscles', 'Muscles'], [['Les cheveux', 'Hair'], ['Les ongles', 'Nails']]),
  mc('hard', 'Combien de dents de lait les enfants ont-ils environ ?', 'About how many baby teeth do children have?', ['Vingt', 'Twenty'], [['Dix', 'Ten'], ['Quarante', 'Forty']]),
);

// --- Hard: everyday physics (6) ---
qs.push(
  mc('hard', 'Qu’est-ce qu’un aimant attire ?', 'What does a magnet attract?', ['Le fer', 'Iron'], [['Le bois', 'Wood'], ['Le plastique', 'Plastic']]),
  tf('hard', 'La glace flotte sur l’eau.', 'Ice floats on water.', true),
  mc('hard', 'Que faut-il pour faire une ombre ?', 'What do you need to make a shadow?', ['De la lumière', 'Light'], [['Du vent', 'Wind'], ['De la pluie', 'Rain']]),
  mc('hard', 'Comment s’appelle ta voix qui revient dans la montagne ?', 'What is it called when your voice comes back in the mountains?', ['L’écho', 'An echo'], [['Le tonnerre', 'Thunder'], ['Une chanson', 'A song']]),
  tf('hard', 'Une plume tombe plus lentement qu’une roche.', 'A feather falls more slowly than a rock.', true),
  mc('hard', 'Que faut-il pour voir un arc-en-ciel ?', 'What do you need to see a rainbow?', ['Du soleil et de la pluie', 'Sun and rain'], [['De la neige et du vent', 'Snow and wind'], ['La nuit et des étoiles', 'Night and stars']]),
);

export const scienceExtraQuestions: Question[] = qs;
