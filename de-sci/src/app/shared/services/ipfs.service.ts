import { Injectable } from '@angular/core';
import { CID, create, IPFSHTTPClient } from 'ipfs-http-client'

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  private _client: IPFSHTTPClient;

  constructor() {
    this._client = create({
      host: 'localhost',
      port: 5002,
      protocol: 'http'
    });

    this._client.id().then((id: any) => {
      console.log("IPFS node ID: " + id.id);
    });
  }

  addFile(file: any, progress: any = null) {
    if(this._client)
      return this._client.add(file, { progress: progress });
    else
      return null;
  }

  getFile(hash: string) {
    if(this._client)
      return this._client.get(hash);
    else
      return null;
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