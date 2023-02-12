import { Component } from '@angular/core';
import { Web3Service } from './shared/services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'de-sci';

  constructor(private web3Service: Web3Service) {
    console.log("Web3: ", web3Service);
  }
}
