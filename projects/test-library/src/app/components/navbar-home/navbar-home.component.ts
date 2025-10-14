import { Component, inject, OnInit } from '@angular/core';
import { IpAuthService } from '../../invopay/services/ip-auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { IpProfileService } from '../../invopay/services/ip-profile.service';
import { filter, Observable } from 'rxjs';
import IpUserProfile from '../../invopay/interface/ip-user-profile';

@Component({
  selector: 'app-navbar-home',
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css'],
})
export class NavbarHomeComponent implements OnInit {
  constructor(private loginService: IpAuthService, private router: Router) {}

  private ipProfileService: IpProfileService = inject(IpProfileService);
  userProfile: Observable<IpUserProfile> = new Observable<IpUserProfile>();
  showProfile: boolean = true;

  ngOnInit(): void {
    // Inicializar showProfile según la ruta actual
    this.showProfile = this.router.url === '/home';

    // Suscribirse a cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEnd = event as NavigationEnd; //Type assertion
        this.showProfile = navEnd.urlAfterRedirects === '/home';
      });

    // Cargar perfil
    this.userProfile = this.ipProfileService.getUserProfile();
  }

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  logOut() {
    console.log('Cerrando sesion...');
    this.loginService.logOut();
    this.router.navigate(['/invopay/login-broker']);
  }
}
