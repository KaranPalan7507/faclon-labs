import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { first } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import { Product } from '../product';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  products: Product[] = [];
  public searchText: any = '';


  constructor(private productService: ProductService, private modalService: ModalService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllProducts();
  }

  deleteProduct(id: number) {
    this.productService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllProducts();
    });
  }

  editProduct(product: Product) {
    this.productService.update(product).pipe(first()).subscribe(() => {
      this.loadAllProducts();
    });
  }

  addProduct(product: Product) {
    this.productService.add(product).pipe(first()).subscribe(() => {
      this.loadAllProducts();
    });
  }

  showDeleteProductModal(id: number) {
    this.modalService.modal.showConfirmationModal();
    const subscription = this.modalService.modal.confirmEvent.subscribe(() => {
      subscription.unsubscribe();
      this.deleteProduct(id);
    });
  }

  showEditProductModal(id: number) {
    this.modalService.modal.formTitle = 'Edit ';
    this.productService.getById(id).subscribe((oldProduct: Product) => {
      this.modalService.modal.showAddProductModal();
      this.modalService.modal.productForm.controls['name'].setValue(oldProduct.name);
      this.modalService.modal.productForm.controls['description'].setValue(oldProduct.description);
      const subscription = this.modalService.modal.confirmEvent.subscribe((product) => {
        subscription.unsubscribe();
        product.id = id;
        this.editProduct(product);
      });
    });
  }

  showAddProductModal() {
    this.modalService.modal.formTitle = 'Add   ';
    this.modalService.modal.showAddProductModal();
    const subscription = this.modalService.modal.confirmEvent.subscribe((product) => {
      subscription.unsubscribe();
      this.addProduct(product);
    });
  }

  private loadAllProducts() {
    this.productService.getAll().pipe(first()).subscribe(products => {
      this.products = products;
    });
  }

}
