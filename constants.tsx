
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'apparel', name: 'Apparel & Clothing', image: 'https://picsum.photos/seed/clothing/400/400', icon: '👕' },
  { id: 'kitchen', name: 'Kitchen & Appliances', image: 'https://picsum.photos/seed/kitchen/400/400', icon: '🍳' },
  { id: 'fashion', name: 'Fashion Accessories', image: 'https://picsum.photos/seed/fashion/400/400', icon: '💍' },
  { id: 'household', name: 'Household Essentials', image: 'https://picsum.photos/seed/home/400/400', icon: '🏠' },
  { id: 'beauty', name: 'Cosmetics & Beauty', image: 'https://picsum.photos/seed/beauty/400/400', icon: '💄' },
  { id: 'electronics', name: 'Gadgets & Electronics', image: 'https://picsum.photos/seed/tech/400/400', icon: '🎧' },
  { id: 'toys', name: 'Toys & Kids', image: 'https://picsum.photos/seed/toys/400/400', icon: '🧸' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cotton Embroidered Kurta',
    description: 'High-quality traditional cotton kurta with detailed embroidery for special occasions. Designed for comfort and durability during the warm seasons in Pakistan. This piece features intricate patterns inspired by traditional heritage.',
    price: 3499,
    originalPrice: 4500,
    category: 'apparel',
    images: ['https://picsum.photos/seed/kurta1/600/800', 'https://picsum.photos/seed/kurta2/600/800'],
    rating: 4.5,
    reviewsCount: 2,
    stock: 15,
    isFeatured: true,
    highlights: ['100% Premium Cotton', 'Intricate Embroidery', 'Breathable Fabric', 'Available in all sizes'],
    specifications: {
      'Material': '100% Cotton',
      'Occasion': 'Formal/Casual',
      'Wash Care': 'Hand wash only',
      'Origin': 'Pakistan'
    },
    reviews: [
      { id: 'r1', userName: 'Aslam Khan', rating: 5, comment: 'Excellent quality and perfect fit!', date: '2024-03-15' },
      { id: 'r2', userName: 'Fatima Z.', rating: 4, comment: 'Very beautiful embroidery.', date: '2024-03-10' }
    ]
  },
  {
    id: '2',
    name: 'Stainless Steel Juicer',
    description: 'Powerful 800W motor juicer with stainless steel blades for fresh drinks. Extract every drop of nutrients from your favorite fruits and vegetables with minimal noise and maximum efficiency.',
    price: 8999,
    originalPrice: 12000,
    category: 'kitchen',
    images: ['https://picsum.photos/seed/juicer/600/600'],
    rating: 4.8,
    reviewsCount: 1,
    stock: 8,
    isFeatured: true,
    highlights: ['800W Powerful Motor', 'Stainless Steel Blades', '2-Speed Control', 'Easy to Clean'],
    specifications: {
      'Power': '800W',
      'Blade Material': 'Stainless Steel',
      'Warranty': '1 Year',
      'Capacity': '1.5 Liters'
    },
    reviews: [
      { id: 'r3', userName: 'Kamran Ali', rating: 5, comment: 'Works like a charm, highly recommended!', date: '2024-03-12' }
    ]
  },
  {
    id: '3',
    name: 'Wireless Bluetooth Earbuds',
    description: 'Noise-canceling earbuds with 24-hour battery life and deep bass. Experience audio like never before with crystal clear sound and ergonomic design perfect for long listening sessions.',
    price: 2499,
    originalPrice: 3999,
    category: 'electronics',
    images: ['https://picsum.photos/seed/earbuds/600/600'],
    rating: 4.2,
    reviewsCount: 0,
    stock: 50,
    highlights: ['Active Noise Cancellation', '24h Total Battery', 'IPX5 Water Resistant', 'Instant Pairing'],
    specifications: {
      'Connectivity': 'Bluetooth 5.2',
      'Battery Life': '24 Hours',
      'Waterproof': 'IPX5',
      'Range': '10 Meters'
    },
    reviews: []
  },
  {
    id: '4',
    name: 'Luxury Matte Lipstick Set',
    description: 'A set of 12 long-lasting matte lipsticks in vibrant shades. From nude to bold red, this collection covers every occasion with a smudge-proof, velvet finish.',
    price: 1850,
    originalPrice: 2500,
    category: 'beauty',
    images: ['https://picsum.photos/seed/lipstick/600/600'],
    rating: 4.9,
    reviewsCount: 0,
    stock: 20,
    isFeatured: true,
    highlights: ['12 Vibrant Shades', 'Long-Lasting Formula', 'Velvet Matte Finish', 'Vitamin E Enriched'],
    specifications: {
      'Quantity': '12 Units',
      'Finish': 'Matte',
      'Type': 'Stick',
      'Skin Type': 'All'
    },
    reviews: []
  }
];
