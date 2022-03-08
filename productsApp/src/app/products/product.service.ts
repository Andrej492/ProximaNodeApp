import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "./product.model";
import { map } from "rxjs/operators"

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  productsChanged: Subject<Product[]> = new Subject<Product[]>();

  constructor(private http: HttpClient) {}

  getProducts(): Product[] {
    this.http
      .get<{message: string, products: any}>(
        'http://localhost:3000/products'
      )
      .pipe(map((productData) => {
        return productData.products.map(product => {
          return {
            id: product._id,
            name: product.name,
            price: product.price,
            available: product.available
          };
        });
      }))
      .subscribe((transformedProducts) => {
        this.products = transformedProducts;
        this.productsChanged.next([...this.products]);
      });
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  deleteProduct(id: string, index: number) {
    this.http.delete<{message: string}>('http://localhost:3000/products/' + id)
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
        this.products.push(product);
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
