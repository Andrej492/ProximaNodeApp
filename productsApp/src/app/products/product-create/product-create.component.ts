import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  @ViewChild('productForm') form: NgForm;
  selectedAvailable: boolean[] = [ false, true];
  productForm: FormGroup;
  editMode: boolean = false;
  isLoading = false;
  product: Product;
  private productId: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.editMode = true;
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productService.getProduct(this.productId).subscribe(
          productData => {
            this.isLoading = false;
            this.product = {
              id: productData._id,
              name: productData.name,
              price: productData.price,
              available: productData.available
            }
            console.log(this.product);
          }
        );
      } else {
        this.editMode = false;
        this.productId = null;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const product: Product = {
      id: null,
      name: form.value.name,
      price: form.value.price,
      available: form.value.available
    };
    this.product.name = form.value.name;
    this.product.price = form.value.price;
    this.product.available = form.value.available;
    if(this.editMode) {
      this.productService.updateProduct(this.product);
    } else {
      this.productService.addProduct(product);
    }
    this.onClear();
  }

  onClear() {
    this.form.resetForm();
    this.editMode = false;
    this.router.navigate([''], {relativeTo: this.route});
  }

}
