import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  editMode: false;
  productForm: FormGroup;
  product: Product;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
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
      this.productService.updateProduct(0, this.form.value)
    } else {
      this.productService.addProduct(product);
    }
    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
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
