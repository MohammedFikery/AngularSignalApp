import { Injectable } from '@angular/core';
import { defer, delay, mergeMap, Observable, of, throwError, timer } from 'rxjs';
import { Product } from './product.interface';
const PRODUCTS: readonly Product[] = [
  { id: 1, title: 'Studio Headphones', description: 'Wireless sound for your everyday rhythm.', price: 129, category: 'Electronics', image: '🎧' },
  { id: 2, title: 'Everyday Backpack', description: 'Thoughtful pockets and a lightweight silhouette.', price: 68, category: 'Accessories', image: '🎒' },
  { id: 3, title: 'Ceramic Mug', description: 'A warm companion for slow mornings.', price: 24, category: 'Home', image: '☕' },
  { id: 4, title: 'Pocket Camera', description: 'Keep the moments that matter.', price: 249, category: 'Electronics', image: '📷' },
  { id: 5, title: 'Desk Lamp', description: 'Warm light for your reading nook or workspace.', price: 85, category: 'Home', image: '💡' },
  { id: 6, title: 'Classic Watch', description: 'Simple lines and a comfortable strap.', price: 110, category: 'Accessories', image: '⌚' },
  { id: 7, title: 'Smart Phone', description: 'Beautiful photos and enough power for your day.', price: 599, category: 'Electronics', image: '📱' },
  { id: 8, title: 'Indoor Planter', description: 'A sculpted ceramic home for your greenery.', price: 32, category: 'Home', image: '🪴' },
];
@Injectable({ providedIn: 'root' })
export class ProductService {
  // A fresh cancellable mock API request for every subscription.
  getProducts(search = '', simulateError = false): Observable<Product[]> {
    return defer(() => timer(600).pipe(mergeMap(() => simulateError
      ? throwError(() => new Error('Something went wrong while loading products.'))
      : of(PRODUCTS.filter(p => p.title.toLowerCase().includes(search.trim().toLowerCase()))))));
  }
  getCategories(): Observable<string[]> {
    return of([...new Set(PRODUCTS.map(p => p.category))].sort()).pipe(delay(100));
  }
}
