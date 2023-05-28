import { Component } from '@angular/core';
import { TranslationService } from '../../app/services/translation.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss'],
})
export class FooterBar {
  constructor(public translationService: TranslationService) {}
}
