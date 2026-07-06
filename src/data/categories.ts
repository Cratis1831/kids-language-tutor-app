import type { Category, CategoryId } from '../types';

export const categories: Record<CategoryId, Category> = {
  math: { id: 'math', name: { fr: 'Mathématiques', en: 'Math' }, color: '#6c4ab6' },
  science: { id: 'science', name: { fr: 'Sciences', en: 'Science' }, color: '#2ec4b6' },
  colours: { id: 'colours', name: { fr: 'Couleurs', en: 'Colours' }, color: '#ff5d8f' },
  shapes: { id: 'shapes', name: { fr: 'Formes', en: 'Shapes' }, color: '#ffc93c' },
  measurements: {
    id: 'measurements',
    name: { fr: 'Mesures', en: 'Measurements' },
    color: '#4f97ff',
  },
};

export const categoryList: Category[] = Object.values(categories);
