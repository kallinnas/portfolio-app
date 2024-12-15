import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { GeneralModule } from '../modules/general.model';
import { FileService } from '../services/file.service';


@Component({
  selector: 'app-cv', standalone: true,
  imports: [GeneralModule, ToolbarComponent],
  templateUrl: './cv.component.html', styleUrl: './cv.component.scss'
})
export class CvComponent implements OnInit {

  cvFile: File | null = null;
  cvPath?: SafeResourceUrl;
  isLoading: boolean = false;
  isFileExist: boolean = false;
  url!: string;

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf() {
    this.fileService.getCv().subscribe(blob => {
      const url = this.createPdfUrl(blob);
      this.cvPath = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.isFileExist = true;
    }, () => this.isFileExist = false);
  }

  uploadPdf(file: File) {
    if (file) {
      this.fileService.uploadPdf(file).subscribe(() => {
        this.cvFile = file;
        this.loadPdf();
      });
    }
  }

  deletePdf() {
    this.fileService.deletePdf().subscribe(() => {
      this.cvPath = undefined;
      this.cvFile = null;
      this.isFileExist = false;
    });
  }

  private createPdfUrl(blob: Blob): string {
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob) + '#toolbar=0&navpanes=0&scrollbar=0';
  }

}
