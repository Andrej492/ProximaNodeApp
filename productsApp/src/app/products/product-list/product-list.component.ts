import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productSub: Subscription;
  isLoading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProducts();
    this.productSub = this.productService.productsChanged.subscribe((products: Product[]) => {
      this.isLoading = false;
      this.products = products;
    })
  }

  onDeleteProduct(productId: string, index: number) {
    this.productService.deleteProduct(productId, index);
  }

  ngOnDestroy(): void {
      this.productSub.unsubscribe();
  }

}
