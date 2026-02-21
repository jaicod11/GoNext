// Pure filtering + sorting logic — no API calls, just client-side processing.
export function filterAndSort(places, filters) {
  let result = [...places];

  // Filter: Open Now
  if (filters.openNow) {
    result = result.filter((p) => p.isOpen === true);
  }

  // Filter: Minimum Rating
  if (filters.minRating > 0) {
    result = result.filter((p) => (p.rating || 0) >= filters.minRating);
  }

  // Filter: Max Distance
  if (filters.maxDistance) {
    result = result.filter((p) => p.distance <= filters.maxDistance);
  }

  // Sort
  if (filters.sortBy === 'distance') {
    result.sort((a, b) => a.distance - b.distance);
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return result;
}