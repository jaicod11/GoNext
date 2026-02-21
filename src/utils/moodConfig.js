// This is the brain — maps each mood to Geoapify place categories.
export const MOODS = [
  {
    id: 'work',
    label: '💼 Work',
    categories: 'catering.cafe',
    sortBy: 'rating',
    color: '#7c6df0',
  },
  {
    id: 'date',
    label: '🌹 Date Night',
    categories: 'catering.restaurant',
    sortBy: 'rating',
    color: '#f06292',
  },
  {
    id: 'quickbite',
    label: '🍔 Quick Bite',
    categories: 'catering.fast_food,catering.food_court',
    sortBy: 'distance',
    color: '#ff9800',
  },
  {
    id: 'budget',
    label: '💸 Budget',
    categories: 'catering.restaurant,catering.cafe',
    sortBy: 'distance',
    color: '#4caf50',
  },
  {
    id: 'explore',
    label: '🗺️ Explore',
    categories: 'tourism.attraction,leisure.park',
    sortBy: 'rating',
    color: '#29b6f6',
  },
];