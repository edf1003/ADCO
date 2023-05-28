import { Component } from '@angular/core';
import { TranslationService } from '../../app/services/translation.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class pageTitle {
  constructor(public translationService: TranslationService) {}
}
