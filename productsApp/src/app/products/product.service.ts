import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stringify } from "querystring";
import { Subject } from "rxjs";
import { Product } from "./product.model";

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  productsChanged: Subject<Product[]> = new Subject<Product[]>();

  constructor(private http: HttpClient) {}

  getProducts(): Product[] {
    this.http.get<{message: string, products: Product[]}>('http://localhost:3000/products')
      .subscribe((productsData) => {
        this.products = productsData.products;
        this.productsChanged.next([...this.products]);
      });
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  deleteProduct(index: number) {
    this.http.delete<{message: string}>('http://localhost:3000/products/:id')
      .subscribe((response) => {
        console.log(response.message);
        this.products.splice(index, 1);
        this.productsChanged.next(this.products.slice());
      });
  }

  addProduct(product: Product) {
    this.http.post<{message: string, product: Product}>('http://localhost:3000/products', product)
      .subscribe((response) => {
        console.log(response.message);
        this.products.push(response.product);
        this.productsChanged.next(this.products.slice());
      });
  }
  updateProduct(index: number, product: Product) {
    this.http.put<{message: string, product: Product}>('http://localhost:3000/products', product)
      .subscribe((response) => {
        console.log(response.message);
        this.products[index] = response.product;
        this.productsChanged.next([...this.products]);
      });
  }
}
