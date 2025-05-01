import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Product } from '../Models/Product.model';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Product Details</h2>
      <div class="card mt-3" *ngIf="product">
        <div class="card-header">
          {{ product.name }}
        </div>
        <div class="card-body">
          <h5 class="card-title">ID: {{ product.id }}</h5>
          <p class="card-text">Description: {{ product.description }}</p>
          <p class="card-text">Price: {{ product.price }} {{ product.currency }}</p>
          <a [routerLink]="['/']" class="btn btn-primary">Back to List</a>
        </div>
      </div>
      <div *ngIf="!product && !loading" class="alert alert-warning mt-3">
        Product not found!
      </div>
      <div *ngIf="loading" class="d-flex justify-content-center mt-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(Number(id)).subscribe(
        data => {
          this.product = data;
          this.loading = false;
        },
        error => {
          console.error('Error fetching product details:', error);
          this.loading = false;
        }
      );
    }
  }
}