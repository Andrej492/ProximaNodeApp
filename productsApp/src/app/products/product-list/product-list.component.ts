import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  totalProducts = 10;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProducts(this.productsPerPage, this.currentPage);
    this.productSub = this.productService.productsChanged.subscribe((products: Product[]) => {
      this.isLoading = false;
      this.products = products;
    }, err => {
      console.log(err);
    });
  }

  onDeleteProduct(productId: string, index: number) {
    this.productService.deleteProduct(productId, index);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productService.getProducts(this.productsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
      this.productSub.unsubscribe();
  }

}
