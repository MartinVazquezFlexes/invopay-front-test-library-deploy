import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SellListComponent } from './components/sales-list/sell-list.component';
import { BaseModule } from 'base';
import { SharedModule } from 'projects/base/src/shared/shared.module';
import { ComponentsModule } from 'projects/base/src/lib/components/components.module';
import { ListFiltersComponent } from './components/list-filters/list-filters.component';
import { CollectionDetailsComponent } from './components/revenue-details/collection-details.component';
import { CollectionsListComponent } from './components/revenues-list/collections-list.component';
import { ProvidersComponent } from './components/payment-entities-list/providers.component';
import { SellDetailsComponent } from './components/sale-details/sell-details.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { InvopayModule } from './invopay/invopay.module';
import { HomeComponent } from './invopay/views/home/home.component';
import { ListFiltersRevenueComponent } from './components/list-filters-revenue/list-filters-revenue.component';
import { TokenInterceptor } from './invopay/services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



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
    //NavbarHomeComponent
  ],
  imports: [
    //BaseModule,
    //ComponentsModule,
    BrowserModule,
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
