import { Injectable } from '@angular/core';
import { ModalsComponent } from '../modals/modals.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    modal: ModalsComponent;
    constructor() {
    }


}
