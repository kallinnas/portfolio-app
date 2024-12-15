import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralModule } from '../../modules/general.model';

@Component({
  selector: 'app-toolbar', standalone: true,
  imports: [GeneralModule],
  templateUrl: './toolbar.component.html', styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  @Input() showUpload: boolean = false;
  @Input() showDownload: boolean = false;
  @Input() showDelete: boolean = false;

  @Output() upload = new EventEmitter<File>();
  @Output() download = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) { this.upload.emit(file); }
  }
}
