import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "./product.model";

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  productsChanged: Subject<Product[]> = new Subject<Product[]>();

  constructor() {}

  getProducts(): Product[] {
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.productsChanged.next(this.products.slice());
  }

  addProduct(product: Product) {
    this.products.push(product);
    this.productsChanged.next(this.products.slice());
  }

  updateProduct(index: number, product: Product) {
    this.products[index] = product;
    this.productsChanged.next(this.products.slice());
  }
}
