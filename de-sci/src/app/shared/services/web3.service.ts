import { Injectable } from '@angular/core';
import { isObservable } from 'rxjs';
import Web3 from 'web3';
import contractData from '../../../assets/contracts/DeSciContract.json';
import { CID } from 'ipfs-http-client';
import { IpfsService } from './ipfs.service';

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
  private lastEvents: any = {};

  private logTx = (txID: any) => console.log("Transaction tx: ", txID);

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      this._ethereum = window.ethereum;
    }
    
    this._web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8000"));

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
    this._contract.events.allEvents({ fromBlock: 0 },  (error: any, event: any) => {
      if(error)
        console.log("Error: ", error);
      else {
        //console.log("Event: ", event);

        this.lastEvents[event.event] = event;
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

      console.log("Getting user data from events: ", this.lastEvents);

      Object.values(this.lastEvents).forEach((event: any) => {
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
        }}
      }
      );
    });
  }

  get accounts(): any {
    return this._accounts;
  }

  publishPaperBC(paperCid: string, repositoryCid: string, infoCid: string) {
    this._contract.methods.addPaper(paperCid, repositoryCid, infoCid).send({ from: this._accounts[0], gas : 1000000 }).then(this.logTx);
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
    return this.lastEvents[eventName];
  }
}
