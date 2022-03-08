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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts();
    this.productSub = this.productService.productsChanged.subscribe((products: Product[]) => {
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
