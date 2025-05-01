import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Product } from '../Models/Product.model';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Add New Product</h2>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="mt-3">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" formControlName="name">
          <div *ngIf="productForm.get('name')?.invalid && (productForm.get('name')?.dirty || productForm.get('name')?.touched)" class="text-danger">
            Name is required.
          </div>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
          <div *ngIf="productForm.get('description')?.invalid && (productForm.get('description')?.dirty || productForm.get('description')?.touched)" class="text-danger">
            Description is required.
          </div>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" class="form-control" id="price" formControlName="price" step="0.01">
          <div *ngIf="productForm.get('price')?.invalid && (productForm.get('price')?.dirty || productForm.get('price')?.touched)" class="text-danger">
            Price is required and must be a positive number.
          </div>
        </div>
        <div class="mb-3">
          <label for="currency" class="form-label">Currency</label>
          <input type="text" class="form-control" id="currency" formControlName="currency">
          <small class="form-text text-muted">Leave empty to use default currency ({{ defaultCurrency }})</small>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">Submit</button>
        <a [routerLink]="['/']" class="btn btn-secondary ms-2">Cancel</a>
      </form>
    </div>
  `
})
export class ProductAddComponent implements OnInit {
  productForm!: FormGroup;
  defaultCurrency: string = 'USD'; // This will be updated from environment

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['']
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const newProduct: Product = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        currency: this.productForm.value.currency || this.defaultCurrency
      };

      this.productService.addProduct(newProduct).subscribe(
        response => {
          console.log('Product added successfully:', response);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error adding product:', error);
        }
      );
    }
  }
}