/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SellListComponent } from './sell-list.component';

describe('SellListComponent', () => {
  let component: SellListComponent;
  let fixture: ComponentFixture<SellListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
