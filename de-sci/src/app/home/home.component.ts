import { Component } from '@angular/core';
import { PaperDetails } from '../shared/model/paper-details';
import { PaperReputation } from '../shared/model/PaperReputation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  papers: PaperDetails[];
  paperReputation: PaperReputation;

  constructor() {
    this.papers = [
      {
        id: 1,
        title: "A paper about something",
        authors: "John Doe",
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet lectus in eros semper lacinia. Etiam vel sagittis ipsum, non lacinia ante. Etiam eget eros vestibulum, ultricies purus ut, blandit diam. Aliquam erat volutpat. Nulla nisl metus, fringilla eget rhoncus a, cursus scelerisque augue. Duis a lacus eget leo malesuada porttitor. Nunc ligula diam, feugiat id metus vitae, condimentum cursus diam. Phasellus sed dignissim nisi. Cras hendrerit neque nunc, vitae pellentesque nunc tempor eu. Pellentesque eu lectus at magna pulvinar pharetra eget cursus nulla. Donec eleifend tempus libero eget ullamcorper. Fusce in nibh rutrum lorem feugiat tempor. Maecenas orci diam, tempus non nisi scelerisque, lobortis dignissim arcu.",
        keywords: ["something", "paper"],
        date: "2020-01-01",
        doi: "10.1234/123456"
      },
      {
        id: 2,
        title: "A paper about something",
        authors: "John Doe",
        abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet lectus in eros semper lacinia. Etiam vel sagittis ipsum, non lacinia ante. Etiam eget eros vestibulum, ultricies purus ut, blandit diam. Aliquam erat volutpat. Nulla nisl metus, fringilla eget rhoncus a, cursus scelerisque augue. Duis a lacus eget leo malesuada porttitor. Nunc ligula diam, feugiat id metus vitae, condimentum cursus diam. Phasellus sed dignissim nisi. Cras hendrerit neque nunc, vitae pellentesque nunc tempor eu. Pellentesque eu lectus at magna pulvinar pharetra eget cursus nulla. Donec eleifend tempus libero eget ullamcorper. Fusce in nibh rutrum lorem feugiat tempor. Maecenas orci diam, tempus non nisi scelerisque, lobortis dignissim arcu.",
        keywords: ["something"],
        date: "2020-01-01",
        doi: "10.1234/123456"
      },
    ];

    this.paperReputation = {
      1: 100,
      2: 50
    }
  }
}
