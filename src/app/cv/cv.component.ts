import { Component } from '@angular/core';
import { GeneralModule } from '../modules/general.model';
import { NgIf } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent {
  cvPath: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.cvPath = this.sanitizer.bypassSecurityTrustResourceUrl('assets/cv.pdf');
  }
}
