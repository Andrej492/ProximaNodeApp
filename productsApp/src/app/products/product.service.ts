import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "./product.model";
import { map } from "rxjs/operators"
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  productsChanged: Subject<Product[]> = new Subject<Product[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(): Product[] {
    this.http
      .get<{message: string, products: any}>(
        'http://localhost:3000/products'
      )
      .pipe(
        map((productData) => {
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

  getProduct(id: string) {
    return this.http.get< { _id: string, name: string, price: number, available: boolean }>(
      "http://localhost:3000/products/" + id);
    //return this.products[index];
  }

  deleteProduct(id: string, index: number) {
    this.http.delete<{message: string}>(
      'http://localhost:3000/products/' + id)
      .subscribe((response) => {
        const updatedProducts = this.products.filter(product => product.id !== id);
        this.products = updatedProducts;
        this.productsChanged.next([...this.products]);
      });
  }

  addProduct(product: Product) {
    this.http
      .post<{message: string, productId: string}>(
      'http://localhost:3000/products', product
      )
      .subscribe((response) => {
        const productId = response.productId;
        product.id = productId;
        this.products.push(product);
        this.productsChanged.next(this.products.slice());
        this.router.navigate(["/"]);
      });
  }
  updateProduct(product: Product) {
    this.http
    .put('http://localhost:3000/products/' + product.id, product)
      .subscribe((response) => {
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex(p => p.id === product.id);
        updatedProducts[oldProductIndex] = product;
        this.products = updatedProducts;
        this.productsChanged.next([...this.products]);
        console.log(this.products);
        console.log(response);
        this.router.navigate(["/"]);
      });
  }
}
