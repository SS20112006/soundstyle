// Affiliate Links Configuration & Deep Link System

// ==========================================
// STORE CONFIGURATION
// ==========================================

export interface StoreConfig {
  name: string;
  logo: string;
  baseUrl: string;
  searchUrl: string;
  affiliateId?: string;
  deepLinkTemplate: string;
  categories: string[];
}

export const STORES: Record<string, StoreConfig> = {
  zara: {
    name: 'Zara',
    logo: 'https://logo.clearbit.com/zara.com',
    baseUrl: 'https://www.zara.com',
    searchUrl: 'https://www.zara.com/pt/pt/search?term=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_ZARA,
    deepLinkTemplate: 'zara://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories'],
  },
  hm: {
    name: 'H&M',
    logo: 'https://logo.clearbit.com/hm.com',
    baseUrl: 'https://www2.hm.com',
    searchUrl: 'https://www2.hm.com/pt_pt/search-results.html?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_HM,
    deepLinkTemplate: 'hm://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories'],
  },
  asos: {
    name: 'ASOS',
    logo: 'https://logo.clearbit.com/asos.com',
    baseUrl: 'https://www.asos.com',
    searchUrl: 'https://www.asos.com/search/?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_ASOS,
    deepLinkTemplate: 'asos://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories'],
  },
  nike: {
    name: 'Nike',
    logo: 'https://logo.clearbit.com/nike.com',
    baseUrl: 'https://www.nike.com',
    searchUrl: 'https://www.nike.com/pt/w?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_NIKE,
    deepLinkTemplate: 'nike://search?q={query}',
    categories: ['shoes', 'tops', 'bottoms', 'accessories'],
  },
  adidas: {
    name: 'Adidas',
    logo: 'https://logo.clearbit.com/adidas.com',
    baseUrl: 'https://www.adidas.pt',
    searchUrl: 'https://www.adidas.pt/pt/search?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_ADIDAS,
    deepLinkTemplate: 'adidas://search?q={query}',
    categories: ['shoes', 'tops', 'bottoms', 'accessories'],
  },
  uniqlo: {
    name: 'Uniqlo',
    logo: 'https://logo.clearbit.com/uniqlo.com',
    baseUrl: 'https://www.uniqlo.com',
    searchUrl: 'https://www.uniqlo.com/pt/search?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_UNIQLO,
    deepLinkTemplate: 'uniqlo://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear'],
  },
  cos: {
    name: 'COS',
    logo: 'https://logo.clearbit.com/cos.com',
    baseUrl: 'https://www.cos.com',
    searchUrl: 'https://www.cos.com/pt/search?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_COS,
    deepLinkTemplate: 'cos://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
  },
  mango: {
    name: 'Mango',
    logo: 'https://logo.clearbit.com/mango.com',
    baseUrl: 'https://shop.mango.com',
    searchUrl: 'https://shop.mango.com/pt/search?q=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_MANGO,
    deepLinkTemplate: 'mango://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses', 'accessories'],
  },
  massimodutti: {
    name: 'Massimo Dutti',
    logo: 'https://logo.clearbit.com/massimodutti.com',
    baseUrl: 'https://www.massimodutti.com',
    searchUrl: 'https://www.massimodutti.com/pt/search?term=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_MASSIMO,
    deepLinkTemplate: 'massimodutti://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'shoes', 'accessories'],
  },
  pullandbear: {
    name: 'Pull&Bear',
    logo: 'https://logo.clearbit.com/pullandbear.com',
    baseUrl: 'https://www.pullandbear.com',
    searchUrl: 'https://www.pullandbear.com/pt/search?term=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_PULLBEAR,
    deepLinkTemplate: 'pullandbear://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
  },
  bershka: {
    name: 'Bershka',
    logo: 'https://logo.clearbit.com/bershka.com',
    baseUrl: 'https://www.bershka.com',
    searchUrl: 'https://www.bershka.com/pt/search?term=',
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_BERSHKA,
    deepLinkTemplate: 'bershka://search?q={query}',
    categories: ['tops', 'bottoms', 'outerwear', 'dresses'],
  },
};

// ==========================================
// BUDGET TO STORE MAPPING
// ==========================================

export function getStoresForBudget(budget: 'low' | 'mid' | 'high'): string[] {
  switch (budget) {
    case 'low':
      return ['hm', 'pullandbear', 'bershka', 'zara', 'asos'];
    case 'mid':
      return ['zara', 'cos', 'uniqlo', 'mango', 'nike', 'adidas', 'asos'];
    case 'high':
      return ['cos', 'massimodutti', 'nike', 'adidas', 'asos'];
    default:
      return ['zara', 'hm', 'asos'];
  }
}

// ==========================================
// STYLE TO STORE AFFINITY
// ==========================================

export function getStoresForStyle(aesthetic: string): string[] {
  const styleStoreMap: Record<string, string[]> = {
    'Cyber-Gothic / Techwear': ['asos', 'nike', 'adidas', 'uniqlo'],
    'Dark Minimal / Noir': ['cos', 'massimodutti', 'uniqlo', 'zara'],
    'Y2K / Club Kid': ['asos', 'bershka', 'pullandbear', 'hm'],
    'Street Pop / Neon': ['nike', 'adidas', 'asos', 'bershka'],
    'Soft Scandinavian': ['cos', 'uniqlo', 'hm', 'mango'],
    'Boho / Folk': ['mango', 'zara', 'hm', 'pullandbear'],
    'Clean / Smart Casual': ['massimodutti', 'cos', 'zara', 'mango'],
    'Punk / Grunge Revival': ['asos', 'pullandbear', 'bershka', 'hm'],
    'Luxury Streetwear': ['nike', 'adidas', 'asos', 'zara'],
    'Ethereal / Dream Pop': ['cos', 'mango', 'zara', 'uniqlo'],
  };
  
  return styleStoreMap[aesthetic] || ['zara', 'hm', 'asos'];
}

// ==========================================
// AFFILIATE URL GENERATOR
// ==========================================

export function generateAffiliateUrl(
  storeKey: string,
  itemQuery: string,
  itemId?: string
): string {
  const store = STORES[storeKey];
  if (!store) return '#';
  
  // Encode the search query
  const encodedQuery = encodeURIComponent(itemQuery);
  
  // Build base URL
  let url = `${store.searchUrl}${encodedQuery}`;
  
  // Add affiliate ID if available
  if (store.affiliateId) {
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}utm_source=soundstyle&utm_medium=affiliate&utm_campaign=${store.affiliateId}`;
  }
  
  return url;
}

// ==========================================
// DEEP LINK GENERATOR (Mobile Apps)
// ==========================================

export function generateDeepLink(storeKey: string, itemQuery: string): string {
  const store = STORES[storeKey];
  if (!store) return '';
  
  return store.deepLinkTemplate.replace('{query}', encodeURIComponent(itemQuery));
}

// ==========================================
// GET BEST STORE FOR ITEM
// ==========================================

export function getBestStoreForItem(
  category: string,
  style: string[],
  budget: 'low' | 'mid' | 'high',
  userAesthetic: string
): string {
  // Get candidate stores based on budget and style
  const budgetStores = getStoresForBudget(budget);
  const styleStores = getStoresForStyle(userAesthetic);
  
  // Find intersection
  const candidateStores = budgetStores.filter(s => styleStores.includes(s));
  
  // Filter by category availability
  const validStores = candidateStores.filter(storeKey => {
    const store = STORES[storeKey];
    return store && store.categories.includes(category);
  });
  
  // Return first valid store or fallback
  return validStores[0] || budgetStores[0] || 'zara';
}

// ==========================================
// PRODUCT DATA GENERATOR
// ==========================================

export interface GeneratedProduct {
  name: string;
  brand: string;
  store: string;
  category: string;
  price: number;
  currency: string;
  searchQuery: string;
  affiliateUrl: string;
  deepLink: string;
  style: string[];
  colors: string[];
}

export function generateProductFromStyle(
  itemDescription: string,
  category: string,
  style: string[],
  colors: string[],
  budget: 'low' | 'mid' | 'high',
  aesthetic: string
): GeneratedProduct {
  const storeKey = getBestStoreForItem(category, style, budget, aesthetic);
  const store = STORES[storeKey];
  
  // Generate realistic price based on budget and category
  const price = generateRealisticPrice(category, budget);
  
  // Clean search query
  const searchQuery = `${itemDescription} ${style[0] || ''}`.trim();
  
  return {
    name: itemDescription,
    brand: store.name,
    store: storeKey,
    category,
    price,
    currency: 'EUR',
    searchQuery,
    affiliateUrl: generateAffiliateUrl(storeKey, searchQuery),
    deepLink: generateDeepLink(storeKey, searchQuery),
    style,
    colors,
  };
}

function generateRealisticPrice(category: string, budget: 'low' | 'mid' | 'high'): number {
  const priceRanges: Record<string, Record<string, [number, number]>> = {
    low: {
      tops: [9.99, 29.99],
      bottoms: [14.99, 39.99],
      outerwear: [29.99, 59.99],
      shoes: [19.99, 49.99],
      accessories: [4.99, 19.99],
      dresses: [14.99, 39.99],
    },
    mid: {
      tops: [19.99, 59.99],
      bottoms: [29.99, 79.99],
      outerwear: [59.99, 149.99],
      shoes: [49.99, 129.99],
      accessories: [9.99, 49.99],
      dresses: [29.99, 89.99],
    },
    high: {
      tops: [49.99, 149.99],
      bottoms: [69.99, 199.99],
      outerwear: [149.99, 399.99],
      shoes: [99.99, 299.99],
      accessories: [29.99, 99.99],
      dresses: [79.99, 249.99],
    },
  };
  
  const range = priceRanges[budget]?.[category] || priceRanges[budget]?.tops || [19.99, 59.99];
  const [min, max] = range;
  
  // Generate price within range
  const randomPrice = min + Math.random() * (max - min);
  
  // Round to .99
  return Math.floor(randomPrice) + 0.99;
}
