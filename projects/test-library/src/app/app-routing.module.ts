import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from 'base';
import { HomeComponent } from './invopay/views/home/home.component';
import { AuthGuardProtectedRoutes } from './guards/auth-routes.guard';
import { NavbarHomeComponent } from './components/navbar/navbar-home/navbar-home.component';
import { SellListComponent } from './components/sales/sales-list/sell-list.component';
import { SellDetailsComponent } from './components/sales/sale-details/sell-details.component';
import { CollectionsListComponent } from './components/revenues/revenues-list/collections-list.component';
import { CollectionDetailsComponent } from './components/revenues/revenue-details/collection-details.component';
import { ProvidersComponent } from './components/payment-entities/payment-entities-list/providers.component';


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
