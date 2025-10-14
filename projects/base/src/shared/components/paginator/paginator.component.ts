import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.itemsView = this.itemsPerPage;
  }
  @Input() totalItems!: number;
  @Input() itemsPerPage!: number;
  @Input() currentPages: number = 1;
  @Input() backgroundColor: string = 'transparent';
  @Output() pageChange = new EventEmitter<number>();

  currentPage = this.currentPages;
  nextPage = this.currentPage + 1;
  nextnextPage = this.currentPage + 2;
  itemsView!: number;
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {

  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.nextPage = this.currentPage + 1;
    this.nextnextPage = this.currentPage + 2;
    this.pageChange.emit(this.currentPage);
    this.viewItems();
  } else {
    console.log('🔵 NO SE EMITE - fuera de rango');
  }
  }

  viewItems() {
    this.itemsView = this.currentPage * this.itemsPerPage;
    if (this.itemsView > this.totalItems) {
      this.itemsView = this.totalItems;
    }
  }
ngOnChanges(changes: SimpleChanges) {
  // Actualizar currentPage si cambió desde el padre
  if (changes['currentPages']) {
    this.currentPage = this.currentPages;
    this.nextPage = this.currentPage + 1;
    this.nextnextPage = this.currentPage + 2;
  }
  
  // Recalcular la vista de items
  this.viewItems();
}
}
