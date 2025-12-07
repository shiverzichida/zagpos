export interface Category {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string | null;
  created_at: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
}

export interface Modifier {
  id: string;
  group_id: string;
  name: string;
  price_adjustment: number;
}

export interface ProductModifier {
  product_id: string;
  modifier_group_id: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  modifiers: SelectedModifier[];
  subtotal: number;
}

export interface SelectedModifier {
  group_id: string;
  group_name: string;
  modifier_id: string;
  modifier_name: string;
  price_adjustment: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  modifiers: SelectedModifier[];
  subtotal: number;
}
