import { Injectable } from '@angular/core';
import Web3 from 'web3';
import contractData from '../../../assets/contracts/DeSciContract.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private _web3: any;
  private _contract: any;
  private _accounts: any;
  private _ethereum: any;
  loggedIn: boolean;
  private _reputation = 0;
  private _paperCount = 0;
  private pastEvents: any = {};
  
  public paperReputations: any = {};

  public infoRepo = '';

  private logTx = (txID: any) => console.log("Transaction tx: ", txID);

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      this._ethereum = window.ethereum;
    }
    
    this._web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7591"));

    // get contract from assets folder
    console.log("Getting contract...")
    this._contract = new this._web3.eth.Contract(contractData.abi, contractData.networks[5777].address);
    console.log("Contract: ", this._contract);

    this.loggedIn = this._accounts && this._accounts.length > 0;
    this.logEvents();
  }

  get web3(): any {
    return this._web3;
  }

  get paperCount(): number {
    return this._paperCount;
  }

  get reputation(): number {
    return this._reputation;
  }

  private logEvents() {
    // log events
    console.warn("Logging events...");
    this._contract.events.allEvents({ fromBlock: 0 },  (error: any, event: any) => {
      if(error)
        console.error("Error: ", error);
      else {
        console.warn("Event: ", event);

        if(!this.pastEvents[event.event])
          this.pastEvents[event.event] = [event];
        else
          this.pastEvents[event.event].push(event);
        
        const isRelatedToUser = this._accounts && event.returnValues.addrUser?.toLowerCase() == this._accounts[0].toLowerCase();

        if(event.event == "PapersInfo")
          this.infoRepo = event.returnValues.papersInfoCid;

        if(event.event == "PaperReputation") {
          console.log("Paper reputation: ", event.returnValues.ipfsCid, event.returnValues.reputation)
          this.paperReputations[event.returnValues.ipfsCid] = event.returnValues.reputation;
        }

        if(isRelatedToUser) {
          switch(event.event) {
            case "UserReputation":
              this._reputation = event.returnValues.reputation;
              break;
            case "ReputationChanged":
              this._reputation = event.returnValues.reputation;
              break;
            case "PaperCount":
              this._paperCount = event.returnValues.count;
              break;
            case "PaperCountChanged":
              this._paperCount = event.returnValues.count;
          }
        }
      }
    });
  }

  async connectAccounts() {
    console.log("Connecting accounts...")
    return await window.ethereum.request({ method: 'eth_requestAccounts' }).then(
      (accounts: any) => {
      this._accounts = accounts;
      this.loggedIn = this._accounts && this._accounts.length > 0;
      console.log("Accounts: ", accounts);

      if(!this.loggedIn)
          return;

      console.log("Getting user data from events: ", this.pastEvents);
      
      Object.values(this.pastEvents).forEach((events: any) => {

        events.forEach((event: any) => {

          const isRelatedToUser = event.returnValues.addrUser?.toLowerCase() == this._accounts[0].toLowerCase();

          if(isRelatedToUser) {
            switch(event.event) {
              case "UserReputation":
                this._reputation = event.returnValues.reputation;
                break;
              case "ReputationChanged":
                this._reputation = event.returnValues.reputation;
                break;
              case "PaperCount":
                this._paperCount = event.returnValues.count;
                break;
              case "PaperCountChanged":
                this._paperCount = event.returnValues.count;
            }
          }
        })
      });
    });
  }

  get accounts(): any {
    return this._accounts;
  }

  async publishPaperBC(paperCid: string, repositoryCid: string, infoCid: string) {
    return await this._contract.methods.addPaper(paperCid, repositoryCid, infoCid).send({ from: this._accounts[0], gas : 1000000 }).then(this.logTx);
  }

  async addReview(paperCid: string, reviewCid: string, isPositive: boolean) {
    return await this._contract.methods.addReview(paperCid, reviewCid, isPositive).send({ from: this._accounts[0], gas : 1000000 }).then(this.logTx);
  }

  getReputationAndPaperCount() {
    this._contract.methods.getUserReputationAndPaperCount().send({ from: this._accounts[0] }).then(this.logTx);
  }

  getReputation() {
    this._contract.methods.getUserReputation().send({ from: this._accounts[0] }).then(this.logTx);
  }

  getPaperReputation(cid: string) {
    this._contract.methods.getPaperReputation(cid).send({ from: this._accounts[0] }).then(this.logTx);
  }

  getPaperCount() {
    this._contract.methods.getPaperCount().send({ from: this._accounts[0] }).then(this.logTx);
  }

  getLastEvent(eventName: any) {
    return this.pastEvents[eventName];
  }
}
