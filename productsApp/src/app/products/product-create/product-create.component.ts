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
        this.product = this.productService.getProduct(this.productId);
      } else {
        this.editMode = false;
        this.productId = null;
      }
    })
    this.productForm = new FormGroup({
      'name': new FormControl(
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
    });
    this.setForm();

  }

  onSubmit(form: NgForm) {
    console.log(form.value.available);
    console.log(form);
    const product: Product = {
      id: null,
      name: form.value.name,
      price: form.value.price,
      available: form.value.available
    }
    if(this.editMode) {
      this.productService.updateProduct(0, this.form.value);
      this.router.navigate([''], {relativeTo: this.route});
    } else {
      this.productService.addProduct(product);
      this.router.navigate([''], {relativeTo: this.route});
    }
    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.router.navigate([''], {relativeTo: this.route});
  }

  private setForm() {
    let name = "";
    let price = 0;
    let available = false;
    if (this.editMode) {
      name = this.product.name;
      price = this.product.price;
      available = this.product.available;
    }
    this.productForm.setValue({
       name: name,
       price: price,
       available: available
    });
  }

}
