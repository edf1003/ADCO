import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-page-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class Information {
  constructor(public translationService: TranslationService) {}
}
