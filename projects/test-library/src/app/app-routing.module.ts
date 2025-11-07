import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './invopay/views/home/home.component';
import { AuthGuardProtectedRoutes } from './guards/auth-routes.guard';
import { NavbarHomeComponent } from './components/navbar/navbar-home/navbar-home.component';
import { SellListComponent } from './components/sales/sales-list/sell-list.component';
import { SellDetailsComponent } from './components/sales/sale-details/sell-details.component';
import { CollectionsListComponent } from './components/revenues/revenues-list/collections-list.component';
import { CollectionDetailsComponent } from './components/revenues/revenue-details/collection-details.component';
import { ProvidersComponent } from './components/payment-entities/payment-entities-list/providers.component';
import { NotificationsListComponent } from './shared/components/notifications-list/notifications-list.component';
import { InsurerNotificationsListComponent } from './components/notifications/insurers/insurer-notifications-list/insurer-notifications-list.component';
import { BrokerNotificationsListComponent } from './components/notifications/brokers/broker-notifications-list/broker-notifications-list.component';
import { SchemesListComponent } from './components/broker/schemes-list/schemes-list.component';
import { BaseComponent } from 'base';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'invopay/login-broker', 
    pathMatch: 'full' 
  },
  { 
    path: 'home',
    component: HomeComponent 
  },
  {
    path: 'invopay',
    loadChildren: () =>
      import('./invopay/invopay.module').then((m) => m.InvopayModule),
  },
  //Estas rutas irian adentro de invopay
  {
    path: '',
    component: NavbarHomeComponent,
    canActivateChild: [AuthGuardProtectedRoutes],
    children: [
      { path: 'invopay/sales-list', component: SellListComponent },
      { path: 'invopay/sale-details', component: SellDetailsComponent },
      { path: 'invopay/revenues-list', component: CollectionsListComponent },
      { path: 'invopay/revenue-details', component: CollectionDetailsComponent },
      { path: 'invopay/payment-entities', component: ProvidersComponent },
      { path: 'invopay/schemes-list', component: SchemesListComponent },
      //{ path: 'invopay/insurer/notification-list', component: InsurerNotificationsListComponent },
      //{ path: 'invopay/broker/notification-list', component: BrokerNotificationsListComponent }
    ],
  },
  {
    path: 'library',
    children: [
      {
        path: 'base',
        component: BaseComponent,
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
