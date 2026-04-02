
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  specialPrice?: number;
  colorCode?: string;
  category: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  isLatest?: boolean;
  isNewArrival?: boolean;
  highlights?: string[];
  specifications?: Record<string, string>;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingCost: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  date: string;
  status: 'pending' | 'dispatched' | 'shipped' | 'delivered' | 'cancelled';
  isNew: boolean;
  paymentMethod: 'cod' | 'online';
  shippingOption: 'fixed' | 'pay_on_arrival';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  code: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isBlocked?: boolean;
  permissions?: {
    canManageProducts: boolean;
    canManageUsers: boolean;
    canManageSite: boolean;
  };
}

export interface Banner {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  tagline: string;
}

export interface CarouselSlide {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  route: string;
}

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface SiteSettings {
  showMegaSale: boolean;
  showFlashSale: boolean;
}

export enum AppRoute {
  HOME = '#/',
  SHOP = '#/shop',
  PRODUCT = '#/product/:id',
  CART = '#/cart',
  CHECKOUT = '#/checkout',
  ACCOUNT = '#/account',
  ORDERS = '#/orders',
  DASHBOARD = '#/admin',
  SEARCH = '#/search',
  LOGIN = '#/login',
  REGISTER = '#/register',
  ABOUT = '#/about',
  CONTACT = '#/contact',
  TRACKING = '#/tracking'
}
