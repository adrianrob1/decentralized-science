import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../shared/model/review';

@Component({
  selector: 'app-publish-review',
  templateUrl: './publish-review.component.html',
  styleUrls: ['./publish-review.component.css']
})
export class PublishReviewDialog {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<PublishReviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Review,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
