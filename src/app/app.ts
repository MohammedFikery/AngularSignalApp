import { Component } from '@angular/core';
import { ProductExplorerComponent } from './products/product-explorer.component';
@Component({ selector: 'app-root', imports: [ProductExplorerComponent], template: '<app-product-explorer />' })
export class App {}
