import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IpLoginComponent } from './components/ip-login/ip-login.component';
import { AuthGuard } from './guards/auth.guard';
import { Template1Component } from './views/template1/template1.component';

const routes: Routes = [
  {
    path: 'login-admin',
    component: IpLoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login-broker',
    component: IpLoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'revenues',
    component: Template1Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvopayRoutingModule { }
