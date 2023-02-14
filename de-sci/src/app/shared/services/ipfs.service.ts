import { Injectable } from '@angular/core';
import { CID, create, IPFSHTTPClient } from 'ipfs-http-client'
import { Web3Service } from './web3.service';
import toBuffer from 'it-to-buffer'
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  private _client: IPFSHTTPClient;
  private _paperInfoRepo: any;

  private _papersInfo = new BehaviorSubject(<any[]>[]);
  public readonly papersInfo = this._papersInfo.asObservable();

  constructor(private web3Service: Web3Service) {
    this._client = create({
      host: 'localhost',
      port: 5002,
      protocol: 'http'
    });

    this._client.id().then((id: any) => {
      console.log("IPFS node ID: " + id.id);
    });

    // update papers info every 1 minute
    // but if there are no papers, try to update every 3 seconds
    let int = setInterval(() => {
      this.updatePapersInfo();

      if(this._papersInfo.value.length > 0) {
        clearInterval(int);
        int = setInterval(() => {
          this.updatePapersInfo();
        }, 1000 * 60 * 1);
      }
    }, 1000 * 3);

    this._client.files.mkdir('/info', { parents: true, flush: true }).then( () => {
      console.log("Created info directory");
    });

    this._client.files.mkdir('/reviews', { parents: true, flush: true }).then(() => {
      console.log("Created reviews directory");
    }
    );
  }

  async updatePapersInfo() {
    return await this.readPapersInfo().then((papersInfo: any[]) => {
      console.log("Papers info: ", papersInfo);
      this._papersInfo.next( papersInfo.map(paperInfo => {
        return {
          id: paperInfo.id,
          cid: paperInfo.cid,
          title: paperInfo.title,
          authors: paperInfo.authors,
          abstract: paperInfo.abstract,
          keywords: paperInfo.keywords,
          date: paperInfo.date,
          doi: paperInfo.doi
          }
        }) );
    });
  }


  async addFile(localFilePath: string, file: any, progress: any = null) {
    if(this._client && this.web3Service.loggedIn) {
      // return this._client.files.write('/' + this.web3Service.accounts[0].slice(2, -1) + '/' + file.name, file, { create:true, parents: true });
      // first we need to create the directory
      await this._client.files.mkdir('/' + this.web3Service.accounts[0].slice(2, -1), { parents: true, flush: true });
      console.log("Created directory...")

      // then we need to add the file
      return this._client.files.write('/' + this.web3Service.accounts[0].slice(2, -1) + '/' + localFilePath, file, { create:true, parents: true, flush: true, progress: progress });
    }
  }

  async addReview(paperCid: string, fileName: string, file: any, progress: any = null) {
    if(this._client && this.web3Service.loggedIn) {
      // return this._client.files.write('/' + this.web3Service.accounts[0].slice(2, -1) + '/' + file.name, file, { create:true, parents: true });
      // first we need to create the directory
      return await this._client.files.mkdir('/reviews/' + paperCid, { parents: true, flush: true }).then(async () => {

        // then we need to add the file
        return await this._client.files.write('/reviews/' + paperCid + '/' + fileName, file, { create:true, parents: true, flush: true, progress: progress });
      });
    }
  }

  async addInfoFile(filePath: string, file: any, progress: any = null) {
    if(this._client && this.web3Service.loggedIn) {
      console.log("Adding info file: ", filePath, file)
      return await this._client.files.mkdir('/info', { parents: true, flush: true }).then(async () => {
        console.log("Created info directory...")
      
        await this._client.files.write('/' + filePath, file, { create:true, parents: true, flush: true, progress: progress });

        // get cid of the info file
        let f = await this.getIpfsHash('/' + filePath);
        console.log("Info file cid: ", f.cid.toString());
        return f.cid.toString();
      });
    }
    else return undefined;
  }

  async getIpfsHash(path: string) {
    return await this._client.files.stat(path, { hash: true });
  }

  async getPaperInfo(cid: string) {
    let fileBuffer = await toBuffer(this._client.files.read('/ipfs/' + cid));

      // parse byte array and push it to the results array
    return JSON.parse(new TextDecoder().decode(fileBuffer));


  }

  async getPdf(path: string) {
    let fileBuffer = await toBuffer(this._client.files.read(path));

    return new File([fileBuffer], path, { type: "application/pdf" });
  }

  async getReviews(paperCid: string) {
    const results: any[] = [];

    console.log("Getting reviews for paper: ", paperCid)
    console.log("Reviews path: ", '/reviews/' + paperCid)
    for await (let file of this._client.files.ls('/reviews/' + paperCid)) {
      const data = await toBuffer(this._client.files.read('/reviews/' + paperCid + '/' + file.name));
      const json = JSON.parse(new TextDecoder().decode(data));
      results.push(json);
    }

    return results;
  }

  async getData(path: string) {
    let fileBuffer = await toBuffer(this._client.files.read(path));

    return fileBuffer;
  }

  async getUserFiles() {
    if(!this.web3Service.loggedIn || !this.web3Service.accounts[0])
      return null;

    const results: any[] = [];

    for await (let resPart of this._client.files.ls('/' + this.web3Service.accounts[0].slice(2, -1))) {
      results.push(resPart);
    }

    return results;
  }

  async getPapersInfoList() {
    const results: any[] = [];

    console.log("Getting papers info list from: ", this.paperInfoRepo)
    for await (let resPart of this._client.files.ls('/info/')) {
      results.push(resPart);
    }

    return results;
  }

  async readPapersInfo() {
    const results: any[] = [];

    const infoFiles = await this.getPapersInfoList();

    console.log("Info files: ", infoFiles);

    for(let file of infoFiles) {
      console.log("Reading file: ", file)
      let fileBuffer = await toBuffer(this._client.files.read('/ipfs/' + file.cid.toString()));

      // parse byte array and push it to the results array
      let paperInfo = JSON.parse(new TextDecoder().decode(fileBuffer))
      paperInfo.cid = file.cid.toString();
      results.push(paperInfo);
    }

    return results;
  }

  get paperInfoRepo(): any {
    let event = this.web3Service.getLastEvent("PapersInfo");
    this._paperInfoRepo = event?.returnValues?.papersInfoCid;

    return this._paperInfoRepo;
  }
}

interface Mtime {
  secs: number
  nsecs?: number
}

export interface AddResult {
  cid: CID
  size: number
  path: string
  mode?: number
  mtime?: Mtime
}