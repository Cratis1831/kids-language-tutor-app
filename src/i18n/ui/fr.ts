// The shape of the UI string table. Add a key here and every locale file must
// provide it (TypeScript enforces this).
export interface UiStrings {
  appTitle: string;
  appTagline: string;
  choosePlayer: string;
  changePlayer: string;
  startAdventure: string;
  backToMap: string;
  level: string;
  locked: string;
  question: string;
  of: string;
  showHint: string;
  hideHint: string;
  hintLabel: string;
  listen: string;
  timeUp: string;
  correct: string;
  notQuite: string;
  nextQuestion: string;
  finishLevel: string;
  levelComplete: string;
  youScored: string;
  outOf: string;
  playAgain: string;
  nextLevel: string;
  true: string;
  false: string;
  starsEarned: string;
}

export const fr: UiStrings = {
  appTitle: 'Aventure Française',
  appTagline: 'Joue, apprends, explore !',
  choosePlayer: 'Qui joue ?',
  changePlayer: 'Changer de joueur',
  startAdventure: "Commencer l'aventure",
  backToMap: 'Retour à la carte',
  level: 'Niveau',
  locked: 'Verrouillé',
  question: 'Question',
  of: 'sur',
  showHint: 'Indice',
  hideHint: "Cacher l'indice",
  hintLabel: 'En anglais',
  listen: 'Écouter',
  timeUp: 'Temps écoulé !',
  correct: 'Bravo !',
  notQuite: 'Pas tout à fait',
  nextQuestion: 'Suivant',
  finishLevel: 'Terminer',
  levelComplete: 'Niveau terminé !',
  youScored: 'Tu as obtenu',
  outOf: 'sur',
  playAgain: 'Rejouer',
  nextLevel: 'Niveau suivant',
  true: 'Vrai',
  false: 'Faux',
  starsEarned: 'Étoiles gagnées',
};
