export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
