import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss'],
})
export class ClusteringComponent {
  constructor(public translationService: TranslationService) {}
}
