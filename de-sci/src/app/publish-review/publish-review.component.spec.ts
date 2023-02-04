import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishReviewComponent } from './publish-review.component';

describe('PublishReviewComponent', () => {
  let component: PublishReviewComponent;
  let fixture: ComponentFixture<PublishReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
