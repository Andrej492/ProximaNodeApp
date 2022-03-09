import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  selectedAvailable: boolean[] = [ false, true];
  form: FormGroup;
  editMode: boolean = false;
  isLoading = false;
  imagePreview: string;
  product: Product;
  private productId: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'name':  new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
        ),
      'price': new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      'available': new FormControl(
        false,
        {validators: [Validators.required]}
      )
      // 'image': new FormControl(
      //   null,
      //   {validators: [Validators.required],
      //   asyncValidators: [mimeType]})
    })
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
            };
            this.form.setValue({
              name: this.product.name,
              price: this.product.price,
              available: this.product.available
            });
          }
        );
      } else {
        this.editMode = false;
        this.productId = null;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const product = {
      id: null,
      name: this.form.value.name,
      price: this.form.value.price,
      available: this.form.value.available
    };
    if(this.editMode) {
      this.product.name = this.form.value.name;
      this.product.price = this.form.value.price;
      this.product.available = this.form.value.available;
      this.productService.updateProduct(this.product);
    } else {
      this.productService.addProduct(product);
    }
    this.onClear();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.router.navigate([''], {relativeTo: this.route});
  }

}
