import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestBase {
  headers = new Headers();
  noPreFlightHeaders = new Headers();
  options = new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  optionsNoPre = new RequestOptions({
    headers: this.noPreFlightHeaders,
    withCredentials: true
  });

  static handleError(res: Response): ErrorObservable<string> {
    let msg: string;
    let error: any = res.json();
    if (error instanceof ProgressEvent) {
      msg = 'Unable to connect server.';
    }
    return Observable.throw(msg);
  }

  static toJson(res: Response): any {
    return res.json();
  }

  constructor(public http: Http) {
    this.headers.append('Content-Type', 'application/json');
    this.noPreFlightHeaders.append('Content-Type', 'text/plain');
  }
}
