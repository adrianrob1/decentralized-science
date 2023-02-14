import { Component } from '@angular/core';
import { PaperDetails } from '../shared/model/paper-details';
import { PaperReputations } from '../shared/model/PaperReputation';
import { IpfsService } from '../shared/services/ipfs.service';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-my-papers',
  templateUrl: './my-papers.component.html',
  styleUrls: ['./my-papers.component.css']
})
export class MyPapersComponent {
  papers: PaperDetails[] = [];

  paperReputations: PaperReputations = {};

  constructor(private web3Service: Web3Service, private ipfsService: IpfsService) {

    this.ipfsService.getMyPapers().then((paperFiles: string[] | undefined) => {
      console.log("My papers: ", paperFiles);
    
      console.log("Extracting my papers from papers info...");
      this.ipfsService.papersInfo.subscribe((papersInfo: any[]) => {
        console.log("Filtering Papers info: ", papersInfo);
        this.papers = papersInfo.filter((paperInfo: any) => paperFiles?.includes(paperInfo.pdfCid));

        this.paperReputations = web3Service.paperReputations;
        console.log("Paper reputations: ", this.paperReputations);
      });
    });
  }
}
