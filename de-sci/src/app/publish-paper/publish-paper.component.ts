import { Component } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileSizeValidator } from '../shared/utils';
import { IpfsService } from '../shared/services/ipfs.service';
import { Web3Service } from '../shared/services/web3.service';
import {Md5} from 'ts-md5';
import { PaperDetailsDTO } from '../shared/model/paper-details';

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
    const paperFl = this.form.get('paperPdf')?.value;
    console.log("Loading PDF:", paperFl);

    if(!paperFl)
      return;

    const hashFile = Md5.hashStr(paperFl.name +paperFl.lastModified +paperFl.size);

    console.log("Sending file to IPFS, hash: ", hashFile)

    this.ipfsService.addFile(hashFile, paperFl, {
      progress: (prog: any) => console.log("received: ", prog)
    })?.then(() => {
      console.log("File added to IPFS");

      // now we want to find the hash of the file
      console.log("Getting dir contents...")
      
      this.ipfsService.getUserFiles()?.then((authorPapersDir: any) => {
        console.log("Dir contents: ", authorPapersDir);

        const paperIpfsFile = authorPapersDir.filter((file: any) => file.name === hashFile)[0];

        console.log("File: ", paperIpfsFile);

        // get dir hash
        this.ipfsService.getIpfsHash('/' + this.web3Service.accounts[0].slice(2, -1) + '/')?.then((authorPapersDirCID: any) => {
          console.log("Dir hash: ", authorPapersDirCID);

          const paperInfo: PaperDetailsDTO = {
            title: this.form.get('title')?.value,
            abstract: this.form.get('abstract')?.value,
            authors: this.form.get('authors')?.value,
            doi: this.form.get('doi')?.value,
            cid: paperIpfsFile.cid.toString(),
            filename: hashFile
          };
          paperInfo['keywords'] = this.form.get('keywords')?.value?.map((keyword: Keyword) => keyword.name);

          // save paper info to IPFS

          this.ipfsService.addInfoFile('/info/' + hashFile, JSON.stringify(paperInfo))?.then(() => { 
            console.log("Paper info added to IPFS")

            // find paper info directory cid

            this.ipfsService.getIpfsHash('/info/')?.then((resultInfo: any) => {
              console.log("New paper Info dir cid: ", resultInfo.cid.toString());

              // publish to blockchain

              this.web3Service.publishPaperBC(paperIpfsFile.cid.toString(), authorPapersDirCID, resultInfo.cid.toString());
            });

          });
        });
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
