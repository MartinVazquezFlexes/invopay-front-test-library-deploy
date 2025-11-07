import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseModule } from 'base';
import { SharedModule } from 'projects/base/src/shared/shared.module';
import { ComponentsModule } from 'projects/base/src/lib/components/components.module';

import { InvopayModule } from './invopay/invopay.module';
import { HomeComponent } from './invopay/views/home/home.component';

import { TokenInterceptor } from './invopay/services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellListComponent } from './components/sales/sales-list/sell-list.component';
import { ListFiltersComponent } from './components/sales/list-filters/list-filters.component';
import { SellDetailsComponent } from './components/sales/sale-details/sell-details.component';
import { CollectionDetailsComponent } from './components/revenues/revenue-details/collection-details.component';
import { CollectionsListComponent } from './components/revenues/revenues-list/collections-list.component';
import { ProvidersComponent } from './components/payment-entities/payment-entities-list/providers.component';
import { ListFiltersRevenueComponent } from './components/revenues/list-filters-revenue/list-filters-revenue.component';
import { NotificationsListComponent } from './shared/components/notifications-list/notifications-list.component';
import { ModalNotificationDetailsComponent } from './shared/components/modal-notification-details/modal-notification-details.component';
import { ModalReplyNotificationComponent } from './shared/components/modal-reply-notification/modal-reply-notification.component';
import { ModalConfirmComponent } from './shared/components/modal-confirm/modal-confirm.component';
import { InsurerNotificationsListComponent } from './components/notifications/insurers/insurer-notifications-list/insurer-notifications-list.component';
import { BrokerNotificationsListComponent } from './components/notifications/brokers/broker-notifications-list/broker-notifications-list.component';
import { SchemesListComponent } from './components/broker/schemes-list/schemes-list.component';
import { ModalSchemaComponent } from './shared/components/modal-schema/modal-schema.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: 
  [
    AppComponent, 
    SellListComponent, 
    ListFiltersComponent, 
    SellDetailsComponent, 
    CollectionDetailsComponent,
    CollectionsListComponent, 
    ProvidersComponent, 
    ListFiltersRevenueComponent,
    NotificationsListComponent,
    ModalNotificationDetailsComponent,
    ModalReplyNotificationComponent,
    ModalConfirmComponent,
    InsurerNotificationsListComponent,
    BrokerNotificationsListComponent,
    SchemesListComponent,
    ModalSchemaComponent
    //NavbarHomeComponent
  ],
  imports: [
    //BaseModule,
    //ComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    //CommonModule,
    //FormsModule,
    //ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        },
    }),
    InvopayModule,
    ComponentsModule
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true, // importante para permitir múltiples interceptores
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
