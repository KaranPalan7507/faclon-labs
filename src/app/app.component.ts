import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ModalsComponent } from './modals/modals.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'fl-project';
  @ViewChild('modal') modal: ModalsComponent;

  constructor(private modalService: ModalService) {

  }

  ngAfterViewInit() {
    this.modal.showWelcomeModal();
    this.modalService.modal = this.modal;
  }
}
