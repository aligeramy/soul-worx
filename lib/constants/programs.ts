export const categoryColors: Record<string, string> = {
  youth: 'from-amber-900 to-amber-800',
  community: 'from-stone-900 to-neutral-900',
  schools: 'from-green-500 to-emerald-500',
  workshops: 'from-orange-500 to-red-500',
}

export const getCategoryGradient = (category: string): string => {
  return categoryColors[category] || 'from-neutral-800 to-neutral-900'
}

