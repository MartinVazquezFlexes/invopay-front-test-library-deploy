import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {

  constructor() { }

  @Output() closeConfirm = new EventEmitter<void>();

  ngOnInit() {
  }

  closeConfirmModal(){
    this.closeConfirm.emit();
  }

}
