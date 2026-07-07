import type { Question } from '../../types';
import { questionFactory, type Opt } from './_compact';

// 80 additional shape questions (ids shapes-21 … shapes-100). 40 easy / 40 hard.

const { mc, tf } = questionFactory('shapes');
const qs: Question[] = [];

const S: Record<string, Opt> = {
  cercle: ['Un cercle', 'A circle'],
  carre: ['Un carré', 'A square'],
  rectangle: ['Un rectangle', 'A rectangle'],
  triangle: ['Un triangle', 'A triangle'],
  ovale: ['Un ovale', 'An oval'],
  losange: ['Un losange', 'A diamond'],
  etoile: ['Une étoile', 'A star'],
  croissant: ['Un croissant', 'A crescent'],
};

// --- Easy: what shape is this object? (24) ---
const objects: [string, string, string, string, string][] = [
  ['une pizza entière', 'a whole pizza', 'cercle', 'carre', 'triangle'],
  ['une part de pizza', 'a slice of pizza', 'triangle', 'cercle', 'ovale'],
  ['une fenêtre', 'a window', 'carre', 'cercle', 'triangle'],
  ['un livre', 'a book', 'rectangle', 'cercle', 'etoile'],
  ['une assiette', 'a plate', 'cercle', 'triangle', 'losange'],
  ['le toit d’une maison dessinée', 'the roof of a drawn house', 'triangle', 'cercle', 'ovale'],
  ['une boîte de mouchoirs', 'a tissue box', 'rectangle', 'cercle', 'triangle'],
  ['une pièce de monnaie', 'a coin', 'cercle', 'carre', 'losange'],
  ['un cerf-volant', 'a kite', 'losange', 'cercle', 'rectangle'],
  ['une horloge murale', 'a wall clock', 'cercle', 'triangle', 'carre'],
  ['un drapeau', 'a flag', 'rectangle', 'cercle', 'croissant'],
  ['un écran de télévision', 'a TV screen', 'rectangle', 'triangle', 'cercle'],
  ['un biscuit', 'a cookie', 'cercle', 'losange', 'triangle'],
  ['une tranche de fromage de dessin animé', 'a cartoon cheese slice', 'triangle', 'ovale', 'carre'],
  ['un ballon de fête gonflé', 'a party balloon', 'ovale', 'carre', 'losange'],
  ['un bouton de chemise', 'a shirt button', 'cercle', 'triangle', 'rectangle'],
  ['une règle', 'a ruler', 'rectangle', 'cercle', 'etoile'],
  ['un chapeau de fête', 'a party hat', 'triangle', 'carre', 'ovale'],
  ['une feuille de papier', 'a sheet of paper', 'rectangle', 'cercle', 'croissant'],
  ['une bulle de savon', 'a soap bubble', 'cercle', 'carre', 'triangle'],
  ['une boîte à pizza', 'a pizza box', 'carre', 'cercle', 'ovale'],
  ['une pointe de flèche', 'an arrowhead', 'triangle', 'cercle', 'ovale'],
  ['un miroir de salle de bain', 'a bathroom mirror', 'rectangle', 'etoile', 'croissant'],
  ['un œuf', 'an egg', 'ovale', 'carre', 'losange'],
];
for (const [fr, en, ok, w1, w2] of objects) {
  qs.push(mc('easy', `Quelle forme a ${fr} ?`, `What shape is ${en}?`, S[ok], [S[w1], S[w2]]));
}

// --- Easy: counting sides and corners (6) ---
qs.push(
  mc('easy', 'Combien de côtés a un cercle ?', 'How many sides does a circle have?', ['Zéro', 'Zero'], [['Un', 'One'], ['Quatre', 'Four']]),
  mc('easy', 'Combien de coins a un carré ?', 'How many corners does a square have?', ['Quatre', 'Four'], [['Trois', 'Three'], ['Cinq', 'Five']]),
  mc('easy', 'Combien de coins a un rectangle ?', 'How many corners does a rectangle have?', ['Quatre', 'Four'], [['Deux', 'Two'], ['Six', 'Six']]),
  mc('easy', 'Combien de côtés a un losange ?', 'How many sides does a diamond have?', ['Quatre', 'Four'], [['Trois', 'Three'], ['Cinq', 'Five']]),
  mc('easy', 'Combien de pointes a un triangle ?', 'How many points does a triangle have?', ['Trois', 'Three'], [['Quatre', 'Four'], ['Deux', 'Two']]),
  mc('easy', 'Combien de côtés a un rectangle ?', 'How many sides does a rectangle have?', ['Quatre', 'Four'], [['Trois', 'Three'], ['Six', 'Six']]),
);

// --- Easy: true/false (4) ---
qs.push(
  tf('easy', 'Un carré a cinq côtés.', 'A square has five sides.', false),
  tf('easy', 'Un rectangle a quatre coins.', 'A rectangle has four corners.', true),
  tf('easy', 'Une étoile est ronde.', 'A star is round.', false),
  tf('easy', 'Un triangle a quatre coins.', 'A triangle has four corners.', false),
);

// --- Easy: sky and fun shapes (6) ---
qs.push(
  mc('easy', 'Quelle forme a parfois la lune ?', 'What shape is the moon sometimes?', S.croissant, [S.carre, S.losange]),
  mc('easy', 'Quelle forme a le soleil dessiné ?', 'What shape is a drawn sun?', S.cercle, [S.rectangle, S.triangle]),
  mc('easy', 'Un diamant dessiné ressemble à…', 'A drawn diamond looks like…', S.losange, [S.cercle, S.rectangle]),
  tf('easy', 'Un cœur dessiné a une pointe en bas.', 'A drawn heart has a point at the bottom.', true),
  mc('easy', 'Quelle forme brille dans le ciel la nuit sur les dessins ?', 'What shape shines in the night sky in drawings?', S.etoile, [S.carre, S.rectangle]),
  tf('easy', 'Une balle est ronde.', 'A ball is round.', true),
);

// --- Hard: polygons (10) ---
qs.push(
  mc('hard', 'Comment s’appelle une forme à cinq côtés ?', 'What is a shape with five sides called?', ['Un pentagone', 'A pentagon'], [['Un hexagone', 'A hexagon'], ['Un octogone', 'An octagon']]),
  mc('hard', 'Comment s’appelle une forme à six côtés ?', 'What is a shape with six sides called?', ['Un hexagone', 'A hexagon'], [['Un pentagone', 'A pentagon'], ['Un triangle', 'A triangle']]),
  mc('hard', 'Combien de côtés a un octogone ?', 'How many sides does an octagon have?', ['Huit', 'Eight'], [['Six', 'Six'], ['Dix', 'Ten']]),
  mc('hard', 'Combien de côtés a un décagone ?', 'How many sides does a decagon have?', ['Dix', 'Ten'], [['Huit', 'Eight'], ['Douze', 'Twelve']]),
  mc('hard', 'Quel panneau routier est un octogone ?', 'Which road sign is an octagon?', ['Le panneau d’arrêt', 'The stop sign'], [['Le panneau d’école', 'The school sign'], ['La flèche', 'The arrow sign']]),
  mc('hard', 'Combien de côtés a un heptagone ?', 'How many sides does a heptagon have?', ['Sept', 'Seven'], [['Cinq', 'Five'], ['Neuf', 'Nine']]),
  tf('hard', 'Un polygone a des côtés droits.', 'A polygon has straight sides.', true),
  tf('hard', 'Un cercle est un polygone.', 'A circle is a polygon.', false),
  mc('hard', 'Quelle forme a le plus de côtés ?', 'Which shape has the most sides?', ['Un décagone', 'A decagon'], [['Un hexagone', 'A hexagon'], ['Un carré', 'A square']]),
  tf('hard', 'Un triangle est un polygone.', 'A triangle is a polygon.', true),
);

// --- Hard: 3D shapes (12) ---
qs.push(
  mc('hard', 'Combien de faces a un dé ?', 'How many faces does a die have?', ['Six', 'Six'], [['Quatre', 'Four'], ['Huit', 'Eight']]),
  mc('hard', 'Quelle forme en 3D a la Terre ?', 'What 3D shape is the Earth?', ['Une sphère', 'A sphere'], [['Un cube', 'A cube'], ['Un cône', 'A cone']]),
  mc('hard', 'Quelle forme en 3D a un cornet de crème glacée ?', 'What 3D shape is an ice-cream cone?', ['Un cône', 'A cone'], [['Un cylindre', 'A cylinder'], ['Une sphère', 'A sphere']]),
  mc('hard', 'Quelle forme en 3D a une boîte de céréales ?', 'What 3D shape is a cereal box?', ['Un pavé droit', 'A rectangular prism'], [['Une sphère', 'A sphere'], ['Un cône', 'A cone']]),
  mc('hard', 'Quelle forme en 3D a un rouleau d’essuie-tout ?', 'What 3D shape is a paper-towel roll?', ['Un cylindre', 'A cylinder'], [['Un cube', 'A cube'], ['Une pyramide', 'A pyramid']]),
  mc('hard', 'Quelle forme en 3D a une base carrée et une pointe ?', 'Which 3D shape has a square base and a point?', ['Une pyramide', 'A pyramid'], [['Un cylindre', 'A cylinder'], ['Une sphère', 'A sphere']]),
  tf('hard', 'Un cube a douze arêtes.', 'A cube has twelve edges.', true),
  mc('hard', 'Combien de sommets a un cube ?', 'How many corners does a cube have?', ['Huit', 'Eight'], [['Six', 'Six'], ['Quatre', 'Four']]),
  tf('hard', 'Une sphère a des coins.', 'A sphere has corners.', false),
  mc('hard', 'Combien de faces plates a un cylindre ?', 'How many flat faces does a cylinder have?', ['Deux', 'Two'], [['Zéro', 'Zero'], ['Quatre', 'Four']]),
  tf('hard', 'Un cône a une pointe.', 'A cone has a point.', true),
  mc('hard', 'Quelle forme en 3D a un glaçon ?', 'What 3D shape is an ice cube?', ['Un cube', 'A cube'], [['Une sphère', 'A sphere'], ['Un cône', 'A cone']]),
);

// --- Hard: corners and combinations (8) ---
qs.push(
  mc('hard', 'Combien de coins a un hexagone ?', 'How many corners does a hexagon have?', ['Six', 'Six'], [['Cinq', 'Five'], ['Huit', 'Eight']]),
  mc('hard', 'Combien de sommets a un pentagone ?', 'How many corners does a pentagon have?', ['Cinq', 'Five'], [['Quatre', 'Four'], ['Six', 'Six']]),
  mc('hard', 'Combien de coins a un octogone ?', 'How many corners does an octagon have?', ['Huit', 'Eight'], [['Six', 'Six'], ['Dix', 'Ten']]),
  tf('hard', 'Un carré a autant de côtés que de coins.', 'A square has as many sides as corners.', true),
  mc('hard', 'Combien de côtés ont deux triangles ensemble ?', 'How many sides do two triangles have together?', ['Six', 'Six'], [['Cinq', 'Five'], ['Huit', 'Eight']]),
  mc('hard', 'Combien de coins ont deux carrés ensemble ?', 'How many corners do two squares have together?', ['Huit', 'Eight'], [['Six', 'Six'], ['Dix', 'Ten']]),
  mc('hard', 'Si on coupe un carré en deux par la diagonale, on obtient deux…', 'If you cut a square in half along the diagonal, you get two…', ['Triangles', 'Triangles'], [['Cercles', 'Circles'], ['Losanges', 'Diamonds']]),
  tf('hard', 'Plus une forme a de côtés, plus elle a de coins.', 'The more sides a shape has, the more corners it has.', true),
);

// --- Hard: symmetry (4) ---
qs.push(
  tf('hard', 'Un papillon a deux côtés identiques.', 'A butterfly has two identical sides.', true),
  mc('hard', 'Quelle lettre a deux côtés identiques ?', 'Which letter has two identical sides?', ['A', 'A'], [['F', 'F'], ['G', 'G']]),
  tf('hard', 'Un cercle peut être plié en deux moitiés égales de plusieurs façons.', 'A circle can be folded into two equal halves in many ways.', true),
  mc('hard', 'Si tu plies un cœur en deux au milieu, les deux moitiés sont…', 'If you fold a heart in half down the middle, the two halves are…', ['Pareilles', 'The same'], [['Différentes', 'Different'], ['Invisibles', 'Invisible']]),
);

// --- Hard: halves and quarters (6) ---
qs.push(
  mc('hard', 'Un cercle coupé en deux donne deux…', 'A circle cut in half makes two…', ['Demi-cercles', 'Half circles'], [['Triangles', 'Triangles'], ['Carrés', 'Squares']]),
  mc('hard', 'Une pizza coupée en quatre parts égales donne des…', 'A pizza cut into four equal pieces makes…', ['Quarts', 'Quarters'], [['Moitiés', 'Halves'], ['Tiers', 'Thirds']]),
  tf('hard', 'Deux moitiés font un tout.', 'Two halves make a whole.', true),
  mc('hard', 'Si tu coupes un carré en deux par le milieu, tu obtiens deux…', 'If you cut a square in half down the middle, you get two…', ['Rectangles', 'Rectangles'], [['Cercles', 'Circles'], ['Étoiles', 'Stars']]),
  mc('hard', 'Combien de quarts y a-t-il dans un tout ?', 'How many quarters are in a whole?', ['Quatre', 'Four'], [['Deux', 'Two'], ['Trois', 'Three']]),
  tf('hard', 'Une moitié est plus grande qu’un quart.', 'A half is bigger than a quarter.', true),
);

export const shapesExtraQuestions: Question[] = qs;
