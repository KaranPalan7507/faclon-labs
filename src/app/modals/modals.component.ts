import { Component, EventEmitter, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Product } from '../product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit {
  @ViewChild('welcome') welcome: TemplateRef<any>;
  @ViewChild('addProduct') addProduct: TemplateRef<any>;
  @ViewChild('confirmation') confirmation: TemplateRef<any>;
  confirmEvent: EventEmitter<Product> = new EventEmitter();
  modalRef: BsModalRef;
  productForm: FormGroup;
  formTitle = 'Add ';

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  showWelcomeModal() {
    this.openModal(this.welcome);
  }

  showAddProductModal() {
    this.productForm.reset();
    this.openModal(this.addProduct);
  }

  showConfirmationModal() {
    this.openModal(this.confirmation);
  }

  confirm(): void {
    this.confirmEvent.next();
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
  get f() { return this.productForm.controls; }

  addProductData() {

    // stop here if form is invalid
    if (this.productForm.invalid) {
      return;
    }
    this.confirmEvent.next(this.productForm.value);
    this.modalRef.hide();
  }

}
