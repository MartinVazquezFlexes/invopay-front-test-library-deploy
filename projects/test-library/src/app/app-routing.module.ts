import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from 'base';
import { SellListComponent } from './components/sales-list/sell-list.component';
import { CollectionsListComponent } from './components/revenues-list/collections-list.component';
import { ProvidersComponent } from './components/payment-entities-list/providers.component';
import { SellDetailsComponent } from './components/sale-details/sell-details.component';
import { CollectionDetailsComponent } from './components/revenue-details/collection-details.component';
import { NavbarHomeComponent } from './components/navbar-home/navbar-home.component';
import { HomeComponent } from './invopay/views/home/home.component';
import { AuthGuardProtectedRoutes } from './guards/auth-routes.guard';


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
