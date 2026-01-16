
export type Locale = 'ar' | 'en';

export interface TechnicalSpecs {
  // Tent specific
  dimensions?: string;
  layers?: number;
  // Chair specific
  foldable?: boolean;
  // Seating specific
  pieces?: number;
  total_dimensions?: string;
  // Common
  material_ar?: string;
  material_en?: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  base_price: number;
  category: string;
  image_url: string;
  gallery: string[];
  specs?: TechnicalSpecs;
  listingType: 'rental' | 'sales';
}

export interface ProductSize {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  price_modifier: number;
}

export interface ProductColor {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  hex_code: string;
}

export interface Booking {
  id: string;
  user_id: string;
  product_id: string;
  product_name_ar?: string;
  product_name_en?: string;
  product_image?: string;
  size_name?: string;
  color?: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface AppState {
  locale: Locale;
  user: any | null;
  isAdmin: boolean;
  cart: Booking[];
}
