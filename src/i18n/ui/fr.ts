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
  leaderboard: string;
  points: string;
  perfect: string;
  editName: string;
  customizeCharacter: string;
  chooseCharacter: string;
  chooseColor: string;
  save: string;
  englishMenus: string;
  playToEarn: string;
  levelsDone: string;
  levelDone: string;
  music: string;
  sounds: string;
  resetScores: string;
  tapToConfirm: string;
  scoresReset: string;
  tierEasy: string;
  tierMedium: string;
  tierHard: string;
  lives: string;
  lifeLost: string;
  lifeLostAbandon: string;
  levelFailed: string;
  passRequirement: string;
  tryAgain: string;
  gameOver: string;
  gameOverMessage: string;
  restartAdventure: string;
  resetProgress: string;
  progressReset: string;
  bonusLife: string;
  completedLabel: string;
  gameRules: string;
  ruleQuestions: string;
  rulePoints: string;
  ruleTimers: string;
  ruleLives: string;
  rulePenalties: string;
  ruleBonus: string;
  ruleGameOver: string;
  tierLegend: string;
  categoryLegend: string;
  minimizeRules: string;
  maximizeRules: string;
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
  leaderboard: 'Tableau des champions',
  points: 'points',
  perfect: 'Parfait !',
  editName: 'Modifier le nom',
  customizeCharacter: 'Personnaliser le personnage',
  chooseCharacter: 'Choisis ton personnage',
  chooseColor: 'Choisis sa couleur',
  save: 'Enregistrer',
  englishMenus: 'Menus en anglais',
  playToEarn: 'Joue pour gagner des points !',
  levelsDone: 'niveaux terminés',
  levelDone: 'niveau terminé',
  music: 'Musique',
  sounds: 'Sons',
  resetScores: 'Réinitialiser les scores',
  tapToConfirm: 'Appuie encore pour confirmer',
  scoresReset: 'Scores remis à zéro !',
  tierEasy: 'Facile',
  tierMedium: 'Moyen',
  tierHard: 'Difficile',
  lives: 'Vies',
  lifeLost: 'Tu as perdu une vie !',
  lifeLostAbandon: 'Niveau quitté : une vie perdue !',
  levelFailed: 'Niveau raté !',
  passRequirement: 'Il te faut au moins {count} bonnes réponses pour réussir.',
  tryAgain: 'Réessayer',
  gameOver: 'Oh non, partie terminée !',
  gameOverMessage: "Tu as perdu toutes tes vies. L'aventure recommence au début !",
  restartAdventure: "Recommencer l'aventure",
  resetProgress: 'Réinitialiser la progression',
  progressReset: 'Progression remise à zéro !',
  bonusLife: 'Vie bonus gagnée !',
  completedLabel: 'Terminé',
  gameRules: 'Règles du jeu',
  ruleQuestions: 'Chaque niveau a 5 questions. Réponds correctement à au moins 3 pour avancer.',
  rulePoints: 'Un niveau réussi rapporte 50, 75 ou 125 points selon son drapeau.',
  ruleTimers: 'Les niveaux moyens et difficiles ont moins de temps par question.',
  ruleLives: 'Tu commences avec 3 cœurs et tu peux en avoir jusqu’à 5.',
  rulePenalties: 'Rater un niveau ou le quitter après avoir répondu coûte 1 cœur.',
  ruleBonus: 'Tous les 5 nouveaux niveaux réussis, tu gagnes un demi-cœur.',
  ruleGameOver: 'À zéro cœur, ta progression recommence au niveau 1.',
  tierLegend: 'Difficulté et points',
  categoryLegend: 'Catégories',
  minimizeRules: 'Réduire les règles',
  maximizeRules: 'Agrandir les règles',
};
