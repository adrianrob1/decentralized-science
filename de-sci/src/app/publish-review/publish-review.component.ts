import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../shared/model/review';
import { IpfsService } from '../shared/services/ipfs.service';
import { Web3Service } from '../shared/services/web3.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-publish-review',
  templateUrl: './publish-review.component.html',
  styleUrls: ['./publish-review.component.css']
})
export class PublishReviewDialog {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required),
    isPositive: new FormControl(true, Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<PublishReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Review,
    private ipfsService: IpfsService,
    private web3Service: Web3Service
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Form is valid");
      if(!this.data.paperId || !this.data.reviewerId) {
        console.log("PaperId or reviewerId is not set");
        return;
      }

      console.log("Form values: ", this.form.value)
      const values = this.form.value as Review;
      this.data.isPositive = values.isPositive;
      this.data.title = values.title;
      this.data.review = values.review;

      const hashReview = Md5.hashStr(this.data.paperId?.toString() + this.data.reviewerId?.toString());

      console.log("Adding review to IPFS: ", this.data, hashReview);

      this.ipfsService.addReview(this.data.paperId.toString(), hashReview, JSON.stringify(this.data)).then(() => {
        console.log("Review added to IPFS");

        // get cid of reviews folder
        this.ipfsService.getIpfsHash('/reviews/').then((reviewsFolderCid) => {

          // Add review to blockchain
          if(!this.data.paperId || !reviewsFolderCid || this.data.isPositive === undefined)
            return;
          this.web3Service.addReview(this.data.paperId, reviewsFolderCid.cid.toString(), this.data.isPositive).then(() => {
            console.log("Review added to blockchain");

            this.dialogRef.close();
          });
        });
      });
    }
  }
}
