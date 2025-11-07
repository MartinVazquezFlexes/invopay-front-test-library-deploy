import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationContext } from '../notifications-list/notifications-list.component';

@Component({
  selector: 'app-modal-reply-notification',
  templateUrl: './modal-reply-notification.component.html',
  styleUrls: ['./modal-reply-notification.component.css'],
})
export class ModalReplyNotificationComponent implements OnInit {
  constructor() {}

  @Input() idNotification: number = 0;
  @Output() closeReply = new EventEmitter<void>();
  @Output() replySend = new EventEmitter<void>();
  @Input() context: NotificationContext = 'insurer';

  ngOnInit() {}

  //Creo los controls
  detailedInfoForm: FormGroup = new FormGroup({
    consultation: new FormControl(
      { value: '', disabled: false },
      Validators.required
    ),
  });

  // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.detailedInfoForm.get(controlName) as FormControl;
  }

  sendReply() {
    if(this.context == 'insurer'){
    //ASEGURADORA
    //API datos: id Notificacion

    //Actualizar tabla = aparece como respondida ahora
    
    //Mensaje confirmacion: "Respuesta enviada correctamente"
    this.replySend.emit();
    }

    if(this.context == 'broker'){
    //CORREDOR
    //API datos: id Notificacion + id User logueado

    //Actualizar tabla = aparece como respondida ahora

    //Mensaje confirmacion: "Respuesta enviada correctamente"
    this.replySend.emit();
    }
  }
}
