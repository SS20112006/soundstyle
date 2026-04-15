import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/search — Search for real products with images
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const store = searchParams.get('store') || 'zara';
    const limit = parseInt(searchParams.get('limit') || '4');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter: q' },
        { status: 400 }
      );
    }
    
    // For now, return placeholder images with product info
    // In production, this would integrate with actual store APIs
    const products = generatePlaceholderProducts(query, store, limit);
    
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('[PRODUCTS-SEARCH] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to search products: ' + error.message },
      { status: 500 }
    );
  }
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  category: string;
  colors: string[];
}

function generatePlaceholderProducts(query: string, store: string, limit: number): Product[] {
  const storeNames: Record<string, string> = {
    zara: 'Zara',
    hm: 'H&M',
    asos: 'ASOS',
    nike: 'Nike',
    adidas: 'Adidas',
    uniqlo: 'Uniqlo',
    cos: 'COS',
    mango: 'Mango',
  };
  
  const brand = storeNames[store] || 'Various';
  
  // Generate realistic product data based on query
  const products: Product[] = [];
  const basePrice = Math.random() * 50 + 20;
  
  for (let i = 0; i < limit; i++) {
    const variation = Math.floor(Math.random() * 3);
    const colors = ['#1a1a1a', '#f5f5dc', '#8b4513', '#4a6fa5', '#c41e3a'];
    
    products.push({
      id: `${store}-${query.replace(/\s+/g, '-')}-${i}`,
      name: `${query} ${['Classic', 'Premium', 'Essential'][variation]}`,
      brand,
      price: Math.round((basePrice + i * 10 + Math.random() * 20) * 100) / 100,
      currency: 'EUR',
      imageUrl: generateProductImage(query, colors[i % colors.length], brand),
      productUrl: `https://www.${store === 'hm' ? 'hm.com' : store + '.com'}/search?q=${encodeURIComponent(query)}`,
      category: detectCategory(query),
      colors: [colors[i % colors.length]],
    });
  }
  
  return products;
}

function generateProductImage(productName: string, color: string, brand: string): string {
  // Generate SVG data URL with product representation
  const categoryEmoji = getCategoryEmoji(detectCategory(productName));
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}33;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}11;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#0a0a0a"/>
      <rect x="20" y="20" width="360" height="460" rx="20" fill="url(#grad)"/>
      <rect x="20" y="20" width="360" height="460" rx="20" fill="none" stroke="${color}40" stroke-width="2"/>
      
      <!-- Brand badge -->
      <rect x="30" y="30" width="80" height="30" rx="15" fill="${color}20"/>
      <text x="70" y="50" font-family="Arial, sans-serif" font-size="12" fill="${color}" text-anchor="middle" font-weight="bold">${brand}</text>
      
      <!-- Product icon -->
      <text x="200" y="280" font-size="80" text-anchor="middle" dominant-baseline="middle">${categoryEmoji}</text>
      
      <!-- Product name -->
      <text x="200" y="380" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">${productName.substring(0, 25)}</text>
      
      <!-- Price placeholder -->
      <rect x="150" y="410" width="100" height="40" rx="20" fill="${color}30"/>
      <text x="200" y="435" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">€XX.XX</text>
    </svg>
  `)}`;
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    tops: '👕',
    bottoms: '👖',
    shoes: '👟',
    outerwear: '🧥',
    accessories: '💎',
    dresses: '👗',
  };
  return emojis[category] || '👕';
}

function detectCategory(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('jacket') || q.includes('coat') || q.includes('hoodie') || q.includes('bomber') || q.includes('vest')) return 'outerwear';
  if (q.includes('jean') || q.includes('pant') || q.includes('trouser') || q.includes('skirt') || q.includes('jogger') || q.includes('cargo')) return 'bottoms';
  if (q.includes('boot') || q.includes('sneaker') || q.includes('shoe') || q.includes('heel') || q.includes('sandal')) return 'shoes';
  if (q.includes('necklace') || q.includes('ring') || q.includes('bag') || q.includes('watch') || q.includes('chain') || q.includes('cap') || q.includes('hat') || q.includes('sunglasses') || q.includes('belt')) return 'accessories';
  if (q.includes('dress')) return 'dresses';
  return 'tops';
}
