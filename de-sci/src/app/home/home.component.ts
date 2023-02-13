import { Component } from '@angular/core';
import { PaperDetails } from '../shared/model/paper-details';
import { PaperReputations } from '../shared/model/PaperReputation';
import { IpfsService } from '../shared/services/ipfs.service';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  papers: PaperDetails[];
  paperReputations: PaperReputations;

  constructor(private web3Service: Web3Service, private ipfsService: IpfsService) {
    this.papers = [];

    console.log("Reading papers info...")
    this.ipfsService.papersInfo.subscribe((papersInfo: any[]) => {
      console.log("Papers info: ", papersInfo);
      this.papers = papersInfo;
    });

    this.paperReputations = web3Service.paperReputations;
  }
}
