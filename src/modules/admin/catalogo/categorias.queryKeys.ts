export const adminCategoryKeys = {
  all: ['admin', 'categories'] as const,
  list: () => [...adminCategoryKeys.all, 'list'] as const,
  publicTaxonomy: ['categories'] as const,
} as const
