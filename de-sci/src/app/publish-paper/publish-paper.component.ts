import { Component } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileSizeValidator } from '../shared/utils';
import { AddResult, IpfsService } from '../shared/services/ipfs.service';
import { PaperDetails, PaperDetailsDTO } from '../shared/model/paper-details';
import { Web3Service } from '../shared/services/web3.service';

export interface Keyword {
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
  
  constructor(private ipfsService: IpfsService, private web3Service: Web3Service) { 
    this.form.get('paperPdf')?.valueChanges.subscribe(value => {
      console.log(value);
      if(value)
        this.pdfSrc = URL.createObjectURL(value);
    });
  }

  loadFile() {
    console.log("Loading PDF:", this.paperFile);
    this.ipfsService.addFile(this.form.get('paperPdf')?.value, {
      progress: (prog: any) => console.log("received: ", prog)
    })?.then((result: AddResult) => {
      console.log("Loading PDF result: ", result);

      const paperInfo: PaperDetailsDTO = {
        title: this.form.get('title')?.value,
        abstract: this.form.get('abstract')?.value,
        authors: this.form.get('authors')?.value,
        doi: this.form.get('doi')?.value,
        id: result.cid.bytes,
      };

      paperInfo['keywords'] = this.form.get('keywords')?.value?.map((keyword: Keyword) => keyword.name);

      this.ipfsService.addFile(JSON.stringify(paperInfo), {
        progress: (prog: any) => console.log("received: ", prog)
      })?.then((result: AddResult) => {
        console.log("Paper Details: ", result);
        
        this.web3Service.publishPaperBC(result.cid.toString());
      });
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

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

    const keywords = this.form.get('keywords')?.value;
    const index = keywords?.indexOf(keyword);
    if (keywords && index && index >= 0) {
      keywords[index] = {name: value};
    }
  }
}
