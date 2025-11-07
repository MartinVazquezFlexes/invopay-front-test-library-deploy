import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationContext } from '../notifications-list/notifications-list.component';

@Component({
  selector: 'app-modal-notification-details',
  templateUrl: './modal-notification-details.component.html',
  styleUrls: ['./modal-notification-details.component.css'],
})
export class ModalNotificationDetailsComponent implements OnInit {
  constructor() {}

  @Input() idNotification: number = 0;
  @Output() closeDetail = new EventEmitter<void>();
  @Output() replySend = new EventEmitter<void>();
  @Input() context: NotificationContext = 'insurer';

  //Creo los controls
  detailedInfoForm: FormGroup = new FormGroup({
    notificationDate: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    entity: new FormControl({ value: '', disabled: true }, Validators.required),
    brokerName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    consultation: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
  });

  ngOnInit() {
    this.getNotificationReplies();
  }

  //Info de la tabla
  tableData: any[] = []; //Reemplazar por model cuando lo tenga
  getNotificationReplies() {
    //Esto por ahora
    this.tableData = this.tableDataTest;

    //Hacer peticion con esto
    console.log('Id de notificacion: ', this.idNotification);

    //Para setear inputs y tabla
    this.setFormValues();
    this.setTableData();
  }

  //Encabezados
  propertyOrder = [
    'replyDate', //Fecha/Hora
    'replyText', //Entidad
    'respondedUser', //Nombre Corredor/Proveedor
  ];

  tableDataTest = [
    {
      id: 1,
      replyDate: '2025-10-30 14:00',
      replyText: 'Quiero consultar por el precio de venta',
      respondedUser: 'Corredor López',
    },
    {
      id: 2,
      replyDate: '2025-10-30 14:00',
      replyText: 'Quiero consultar por el precio de venta',
      respondedUser: 'Corredor López',
    },
    {
      id: 3,
      replyDate: '2025-10-30 14:00',
      replyText: 'Quiero consultar por el precio de venta',
      respondedUser: 'Corredor López',
    },
    {
      id: 4,
      replyDate: '2025-10-30 14:00',
      replyText: 'Quiero consultar por el precio de venta',
      respondedUser: 'Corredor López',
    },
  ];

    notificationData = {
      id: 1,
      notificationDate: '2025-10-30 14:00',
      entity: 'Aseguradora Delta',
      brokerName: 'Corredor López',
      consultation: 'Consulta sobre póliza activa',
    }
  

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Acciones de la tabla
  actions: string[] = [];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = false;

  //Si queremos scroll o no
  scroll = true;

  //Cuando se pulsa el boton de detalle le paso el
  // dataField que tiene la informacion del objeto
  onAction(event: any) {
    console.log('Acción recibida:', event);
  }

  //Si seleccionamos items
  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  setFormValues() {
    //if (!this.revenueDetailsFormatted) return;

    this.detailedInfoForm.patchValue({
      //transaccion
      notificationDate: this.notificationData.notificationDate || '',
      entity: this.notificationData.entity || '',
      brokerName: this.notificationData.brokerName || '',
      consultation: this.notificationData.consultation || '',
    });
  }

  setTableData() {
    //cargo la tabla con los datos del back
    /*this.tableData = this.revenueDetails.policyData.premiumPaymentPlan.map(
      (installment) => {
        const isPaid = installment.isPaid;

        return {
          installmentNumber: installment.installmentNumber,
          dueDate: installment.dueDate.split('T')[0],
          amount: formattedAmount,
          isPaid: isPaid ? 'Pagada' : 'No Pagada',
        };
      }
    );*/
  }

  // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.detailedInfoForm.get(controlName) as FormControl;
  }

  //Navegar entre secciones
  showDetail = true; //La que empieza siempre por default
  showReplies = false;
  showReplySended = false; //mostrar modal mensaje de confirmacion de envio
  hasReplies = true; //CAMBIAR segun replies.lenght > 0
  activeSection: string = 'detail'; //Para remarcar la seccion donde estoy

  showDetailSection() {
    this.showDetail = true; //Mostrar
    this.showReplies = false;
    this.activeSection = 'detail';
  }

  showRepliesSection() {
    this.showDetail = false;
    this.showReplies = true; //Mostar
    this.activeSection = 'replies';
  }

  replyId: number = 0;
  showModalResponse : boolean = false;

  openModalResponse() {
    //pasarle el id al modal
    this.replyId = this.idNotification;
    this.showModalResponse = true;
  }

  closeModalResponse() {
    this.replyId = 0;
    this.showModalResponse = false;
  }

  showConfirmReplySend(){
    this.replySend.emit();
  }


  onSort(event: any) {
    const sortKey = event.key; //revenueDateDisplay
    const sortEvent = event.event; //'asc', 'desc' o 'clean'

    //mapear al original
    const sortFieldMap: { [key: string]: string } = {
      replyDate: 'replyDate',
    };

    const actualSortField = sortFieldMap[sortKey] || sortKey;

    if (sortEvent === 'clean') {
      this.tableDataTest = [...this.tableDataTest];
    } else {
      this.tableDataTest.sort((a, b) => {
        let aValue = (a as any)[actualSortField];
        let bValue = (b as any)[actualSortField];

        //convertir a fecha para sort
        if (actualSortField === 'replyDate') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) return sortEvent === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortEvent === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
}
