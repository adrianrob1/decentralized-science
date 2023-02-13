import { Component } from '@angular/core';
import { Review } from '../shared/model/review';
import { MatDialog } from '@angular/material/dialog';
import { PublishReviewDialog } from 'src/app/publish-review/publish-review.component';
import { IpfsService } from '../shared/services/ipfs.service';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.css']
})
export class PaperDetailComponent {
  showReviewsFlag = false;

  paper: any = {};

  pdfSrc: any = '';

  reviews: Review[] = [{
    paperId: '1',
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  },
  {
    paperId: '1',
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  },
  {
    paperId: '1',
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  }

];

  paperId = '1';

  constructor(private dialog: MatDialog, private ipfsService: IpfsService, private activatedRoute: ActivatedRoute, private web3Service: Web3Service) {
    this.activatedRoute.params.subscribe(params => {
      // retrieve paper info from IPFS using params.id
      // this.ipfsService.getData('/ipfs/' + params['id']).then((paperInfo: any) => {
      //   this.pdfSrc = {data: paperInfo};
      // });

      // retrieve paper info from IPFS using params.id
      this.ipfsService.getPaperInfo(params['id']).then((paperInfo: any) => {
        console.log(paperInfo);

        this.paper = {
          id: paperInfo.id,
          doi : paperInfo.doi,
          title : paperInfo.title,
          abstract : paperInfo.abstract,
          authors : paperInfo.authors,
          keywords : paperInfo.keywords
        };

        this.ipfsService.getData('/ipfs/' + paperInfo.cid).then((paperInfo: any) => {
          this.pdfSrc = {data: paperInfo};
        });
      });
    });
  }

  reviewPaper(): void {
    const data: Review = {
      paperId: this.paperId, 
      reviewerId: this.web3Service.accounts[0], 
      reviewerReputation: this.web3Service.reputation
    };
    const dialogRef = this.dialog.open(PublishReviewDialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Result: ', result);
    });
  }
}
