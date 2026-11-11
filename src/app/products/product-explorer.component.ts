import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { Product, SortOption } from './product.interface';
import { ProductService } from './product.service';
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
const INITIAL_STATE: ProductState = { products: [], loading: true, error: null };
@Component({
  selector: 'app-product-explorer',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-explorer.component.html',
  styleUrl: './product-explorer.component.css',
})
export class ProductExplorerComponent {
  private readonly service = inject(ProductService);
  private readonly retryRequests = new Subject<void>();
  readonly searchTerm = signal<string>('');
  readonly selectedCategory = signal<string>('');
  readonly selectedSort = signal<SortOption>('name-asc');
  readonly simulateError = signal<boolean>(false);
  readonly categories = toSignal(this.service.getCategories(), { initialValue: [] });
  private readonly search = toObservable(this.searchTerm).pipe(
    map((value) => value.trim().toLowerCase()),
    debounceTime(300),
    distinctUntilChanged(),
  );
  private readonly state = toSignal(
    combineLatest([this.search, this.retryRequests.pipe(startWith(undefined))]).pipe(
      switchMap(([search]) =>
        this.service.getProducts(search, this.simulateError()).pipe(
          map((products) => ({ products, loading: false, error: null }) as ProductState),
          catchError(() =>
            of<ProductState>({
              products: [],
              loading: false,
              error: 'Something went wrong while loading products.',
            }),
          ),
          startWith(INITIAL_STATE),
        ),
      ),
    ),
    { initialValue: INITIAL_STATE },
  );
  readonly products = computed(() => this.state().products);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filteredProducts = computed(() =>
    this.products().filter(
      (p) => !this.selectedCategory() || p.category === this.selectedCategory(),
    ),
  );
  readonly sortedProducts = computed(() =>
    [...this.filteredProducts()].sort((a, b) => {
      switch (this.selectedSort()) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return a.title.localeCompare(b.title);
      }
    }),
  );
  readonly productCount = computed(() => this.sortedProducts().length);
  readonly filtersActive = computed(
    () => !!this.searchTerm() || !!this.selectedCategory() || this.selectedSort() !== 'name-asc',
  );
  readonly showEmpty = computed(
    () => !this.loading() && !this.error() && this.productCount() === 0,
  );
  setSort(value: string): void {
    if (['price-asc', 'price-desc', 'name-asc', 'name-desc'].includes(value))
      this.selectedSort.set(value as SortOption);
  }
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedSort.set('name-asc');
  }
  retry(): void {
    this.retryRequests.next();
  }
}
