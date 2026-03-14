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

  // ✅ NEW: Filter by price range
  if (filters.priceRange && filters.priceRange.length > 0) {
    result = result.filter((p) => {
      // Simulate price based on distance (closer = pricier)
      const price = p.distance < 1000 ? 3 : p.distance < 3000 ? 2 : 1;
      return filters.priceRange.includes(price);
    });
  }

  // ✅ NEW: Filter by category
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => {
      const cat = p.category.toLowerCase();
      return cat.includes(filters.category);
    });
  }

  // Sort
  if (filters.sortBy === 'distance') {
    result.sort((a, b) => a.distance - b.distance);
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return result;
}