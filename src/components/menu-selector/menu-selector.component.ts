import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../app/services/translation.service';

@Component({
  selector: 'app-menu-selector',
  templateUrl: './menu-selector.component.html',
  styleUrls: ['./menu-selector.component.scss'],
})
export class menuSelector {
  isSpanishFlagVisible = true;

  constructor(
    private translate: TranslateService,
    public translationService: TranslationService
  ) {
    translate.setDefaultLang('es');
  }

  toggleLanguage() {
    var language = this.isSpanishFlagVisible ? 'en' : 'es';
    this.isSpanishFlagVisible = !this.isSpanishFlagVisible;
    this.translate.use(language);
  }
}
