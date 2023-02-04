import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPaperComponent } from './publish-paper.component';

describe('PublishPaperComponent', () => {
  let component: PublishPaperComponent;
  let fixture: ComponentFixture<PublishPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishPaperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
