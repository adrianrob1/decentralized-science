import { Component } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileSizeValidator } from '../shared/utils';

interface Keyword {
  name: string;
}

@Component({
  selector: 'app-publish-paper',
  templateUrl: './publish-paper.component.html',
  styleUrls: ['./publish-paper.component.css'],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [COMMA, ENTER]
      }
    }
  ]
})
export class PublishPaperComponent {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  keywords: Keyword[] = [];
  pdfSrc = '';

  paperFile = new File([], 'paper.pdf');

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    abstract: new FormControl('', Validators.required),
    authors: new FormControl('', Validators.required),
    keywords: new FormControl(this.keywords, Validators.required),
    doi: new FormControl(''),
    paperPdf: new FormControl(this.paperFile, FileSizeValidator),
  });
  
  constructor() {
    this.form.get('paperPdf')?.valueChanges.subscribe(value => {
      console.log(value);
      if(value)
        this.pdfSrc = URL.createObjectURL(value);
    });
  }

  loadFile() {

  }

  log() {
    console.log(this.form.value);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const keywords = this.form.get('keywords')?.value;
      keywords?.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(keyword: Keyword): void {
    const keywords = this.form.get('keywords')?.value;
    const index = keywords?.indexOf(keyword);

    if (keywords && index && index >= 0) {
      keywords?.splice(index, 1);
      this.form.patchValue({keywords: keywords})
    }
  }

  edit(keyword: Keyword, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(keyword);
      return;
    }

    // Edit existing fruit
    const keywords = this.form.get('keywords')?.value;
    const index = keywords?.indexOf(keyword);
    if (keywords && index && index >= 0) {
      keywords[index] = {name: value};
    }
  }
}
