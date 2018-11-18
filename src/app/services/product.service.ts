import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Product } from '../product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/products/` + id);
  }

  add(product: Product) {
    return this.http.post(`${environment.apiUrl}/products/add`, product);
  }

  update(product: Product) {
    return this.http.put(`${environment.apiUrl}/products/` + product.id, product);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/products/` + id);
  }
}

