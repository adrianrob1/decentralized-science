import { Component } from '@angular/core';
import { Web3Service } from '../shared/services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedIn = false;

  constructor(public web3Service: Web3Service) {
    this.loggedIn = this.web3Service.loggedIn;
  }

  login() {
    this.web3Service.connectAccounts().then(() => {
      console.log("Logged in: ", this.web3Service.loggedIn);
      this.loggedIn = this.web3Service.loggedIn;

      // Get user tokens and number of papers
      // this.web3Service.getReputationAndPaperCount();
    });
  }
}
