import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IpLoginComponent } from './components/ip-login/ip-login.component';

import { IpAuthService } from './services/ip-auth.service';
import { IpProfileService } from './services/ip-profile.service';
import { IpSnackbarService } from './services/ip-snackbar.service';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { InvopayRoutingModule } from './invopay-routing.module';
import { HomeComponent } from './views/home/home.component';
import { Template1Component } from './views/template1/template1.component';
import { NavbarHomeComponent } from '../components/navbar/navbar-home/navbar-home.component';


@NgModule({
    declarations: [
        IpLoginComponent,
        HomeComponent,
        Template1Component,
        NavbarHomeComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        InvopayRoutingModule,
        ReactiveFormsModule,
        TranslateModule,
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        RouterModule,
        SharedModule
    ],
    providers: [
        IpAuthService,
        IpProfileService,
        IpSnackbarService,
        SharedModule
    ],
    exports: [
        IpLoginComponent
    ]
})
export class InvopayModule { }