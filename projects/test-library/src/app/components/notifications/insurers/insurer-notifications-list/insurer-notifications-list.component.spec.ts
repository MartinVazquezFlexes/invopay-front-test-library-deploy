/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InsurerNotificationsListComponent } from './insurer-notifications-list.component';

describe('InsurerNotificationsListComponent', () => {
  let component: InsurerNotificationsListComponent;
  let fixture: ComponentFixture<InsurerNotificationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurerNotificationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurerNotificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
