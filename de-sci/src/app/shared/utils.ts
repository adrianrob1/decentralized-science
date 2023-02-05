import { AbstractControl } from "@angular/forms";

export function FileSizeValidator() {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const file = control.value;
    if(file && file.size > 0)
      return {fileSize: true};
    return null;
  }
}
