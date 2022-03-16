import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "./product.model";
import { map } from "rxjs/operators"
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  productsChanged = new Subject<Product[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, products: any, maxProducts: number}>(
        'http://localhost:3000/products' + queryParams
      )
      .pipe(
        map((productData) => {
          return { products: productData.products.map(product => {
            return {
              id: product._id,
              name: product.name,
              price: product.price,
              available: product.available,
              dateCreated: new Date(product.dateCreated).toISOString(),
              dateUpdated: new Date(product.dateUpdated).toISOString(),
              edited: product.edited
            };
          }), maxProducts: productData.maxProducts
        };
      }))
      .subscribe((transformedProductsData) => {
        this.products = transformedProductsData.products;
        this.productsChanged.next([...this.products]);
      }, error => {
        console.log(error);
      });
  }

  getProduct(id: string) {
    return this.http.get< {
      _id: string,
      name: string,
      price: number,
      available: boolean,
      dateCreated: Date,
      dateUpdated: Date,
      edited: boolean }>
      ("http://localhost:3000/products/" + id);
    //return this.products[index];
  }

  deleteProduct(id: string, index: number) {
    this.http.delete<{message: string}>(
      'http://localhost:3000/products/' + id)
      .subscribe((response) => {
        const updatedProducts = this.products.filter(product => product.id !== id);
        this.products = updatedProducts;
        this.productsChanged.next([...this.products]);
      }, err => {
        console.log(err);
      });
  }

  addProduct(product: Product) {
    // const productData = new FormData();
    // productData.append("name", product.name);
    // productData.append("price", product.price);
    // productData.append("name", product.available);
    this.http
      .post<{message: string, productResponse: any}>(
      'http://localhost:3000/products', product
      )
      .pipe(
        map((productData) => {
          return productData.productResponse.map((productRes) => {
            return {
              id: productRes._id,
              name: productRes.name,
              price: productRes.price,
              available: productRes.available,
              dateCreated: new Date(productRes.dateCreated).toISOString(),
              dateUpdated: new Date(productRes.dateUpdated).toISOString(),
              edited: productRes.edited
            };
          });
      }))
      .subscribe((response) => {
        console.log(response);
        this.products.push(response);
        this.productsChanged.next(this.products.slice());
        this.router.navigate(["/"]);
      }, err => {
        console.log(err);
      });
  }

  updateProduct(product: Product) {
    this.http
    .put<{ message: string, productResponse: any}>(
      'http://localhost:3000/products/' + product.id,
       product
    )
    .pipe(
      map((productData) => {
        return productData.productResponse.map((productRes) => {
          return {
            id: productRes._id,
            name: productRes.name,
            price: productRes.price,
            available: productRes.available,
            dateUpdated: new Date(productRes.dateUpdated).toISOString(),
            edited: productRes.edited
          };
        });
    }))
    .subscribe((response) => {
        console.log(response);
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex(p => p.id === product.id);
        updatedProducts[oldProductIndex] = response;
        this.products = updatedProducts;
        this.productsChanged.next([...this.products]);
        this.router.navigate(["/"]);
      }, err => {
        console.log(err);
      });
  }
}
