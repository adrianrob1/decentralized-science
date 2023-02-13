import { Component } from '@angular/core';
import { PaperDetails } from '../shared/model/paper-details';
import { PaperReputation } from '../shared/model/PaperReputation';
import { IpfsService } from '../shared/services/ipfs.service';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  papers: PaperDetails[];
  paperReputation: PaperReputation;
  papersInfo: any[] = [];

  constructor(private web3Service: Web3Service, private ipfsService: IpfsService) {
    this.papers = [];

    this.paperReputation = {
      1: 100
    }

    if(this.web3Service && this.ipfsService && this.ipfsService.paperInfoRepo) {
      console.log("Reading papers info...")
      this.ipfsService.readPapersInfo().then((papersInfo: any[]) => {
        console.log("Papers info: ", papersInfo);
        this.papers = papersInfo.map(paperInfo => {
          return {
            id: paperInfo.cid,
            title: paperInfo.title,
            authors: paperInfo.authors,
            abstract: paperInfo.abstract,
            keywords: paperInfo.keywords,
            date: paperInfo.date,
            doi: paperInfo.doi
            }
          });
      });
    }
  }
}
