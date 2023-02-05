import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  filename: string | undefined;

  @Input() formGroup: any;
  @Input() name: any;

  constructor() {
    if(!this.name)
      this.name = 'default';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if(file) {
      this.filename = file.name;
      
      if(this.formGroup && this.name)
        this.formGroup.get(this.name)?.setValue(file);
    }
  }
}
