import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-library';

    constructor(private translate: TranslateService) {
    //configurar idiomas disponibles
    translate.addLangs(['es', 'pt']);
    
    //establecer idioma por defecto
    translate.setDefaultLang('es');
    
    //usar español (o detectar del navegador)
    translate.use('es');
  }

  ngOnInit() {

  }

}
