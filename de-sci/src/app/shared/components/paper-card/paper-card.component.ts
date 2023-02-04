import { Component, HostListener, Input } from '@angular/core';
import { PaperDetails } from '../../model/paper-details';

@Component({
  selector: 'app-paper-card',
  templateUrl: './paper-card.component.html',
  styleUrls: ['./paper-card.component.css']
})
export class PaperCardComponent {
  maxTextLength: number = 200;
  maxTextLengthTitle: number = 100;
  maxKeywords: number = 5;

  @Input() paper: PaperDetails = {
    id: 0,
    title: "No title",
    authors: "No authors",
    abstract: "No abstract",
    keywords: [],
    date: "No date",
    doi: "No DOI"
  };

  @Input() reputation: number = 0;

  constructor() {}

  ngOnInit() {
    this.maxTextLength = window.innerWidth < 900 ? 80 : 200;
    this.maxTextLength = window.innerWidth < 600 ? 50 : this.maxTextLength;

    this.maxTextLengthTitle = window.innerWidth < 750 ? 5 : 40;

    this.maxKeywords = window.innerWidth < 900 ? 2 : 5;
    this.maxKeywords = window.innerWidth < 600 ? 1 : this.maxKeywords;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.maxTextLength = window.innerWidth < 900 ? 80 : 200;
    this.maxTextLength = window.innerWidth < 600 ? 50 : this.maxTextLength;

    this.maxTextLengthTitle = window.innerWidth < 750 ? 5 : 40;

    this.maxKeywords = window.innerWidth < 900 ? 2 : 5;
    this.maxKeywords = window.innerWidth < 600 ? 1 : this.maxKeywords;
  }
}
