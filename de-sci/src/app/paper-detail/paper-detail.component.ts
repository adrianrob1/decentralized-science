import { Component } from '@angular/core';
import { Review } from '../shared/model/review';
import { MatDialog } from '@angular/material/dialog';
import { PublishReviewDialog } from 'src/app/publish-review/publish-review.component';
import { PaperDetails } from '../shared/model/paper-details';
import { IpfsService } from '../shared/services/ipfs.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.css']
})
export class PaperDetailComponent {
  showReviewsFlag = false;

  paper: PaperDetails = {
    id: 1,
    doi : '10.48550/arXiv.2202.05780',
    title : 'A Modern Self-Referential Weight Matrix That Learns to Modify Itself',
    abstract : 'The weight matrix (WM) of a neural network (NN) is its program. The programs of many traditional NNs are learned through gradient descent in some error function, then remain fixed. The WM of a self-referential NN, however, can keep rapidly modifying all of itself during runtime. In principle, such NNs can meta-learn to learn, and meta-meta-learn to meta-learn to learn, and soon, in the sense of recursive self-improvement. While NN architectures potentially capable of implementing such behaviour have been proposed since the ’90s, there have been few if any practical studies. Here we revisit such NNs, building upon recent successes of fast weight programmers and closely related linear Transformers. We propose a scalable self-referential WM (SRWM) that learns to use outer products and the delta update rule to modify itself. We evaluate our SRWM in supervised few-shot learning and in multi-task reinforcement learning with procedurally generated game environments. Our experiments demonstrate both practical applicability and competitive performance of the proposed SRWM. Our code is public.',
    authors : 'Kazuki Irie, Imanol Schlag, Robert Csord, Jurgen Schmidhuber',
    keywords : ['Few-Shot Learning', 'Meta-Learning', 'Neural Networks', 'Self-Referential Neural Networks', 'Weight Programming']
  };

  pdfSrc: any = 'https://arxiv.org/pdf/2202.05780.pdf';

  reviews: Review[] = [{
    id: 1,
    paperId: 1,
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  },
  {
    id: 1,
    paperId: 1,
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  },
  {
    id: 1,
    paperId: 1,
    reviewerId: 1,
    review: 'This paper is very interesting and I would like to see it published.',
    title: 'Very interesting',
    reviewerReputation: 120
  }

];

  paperId = 1;

  constructor(private dialog: MatDialog, private ipfsService: IpfsService, private activatedRoute: ActivatedRoute) {
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
    const data: Review = {paperId: this.paperId};
    const dialogRef = this.dialog.open(PublishReviewDialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Result: ', result);
    });
  }
}
