import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SubmittimesheetProvider {
  actionURI:any;

  constructor(public _http: HttpClient) {
    console.log('Hello SubmittimesheetProvider Provider');
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURI = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURI = 'http://192.168.75.12:6022/api/ECorner/';
  }
  //login page method
  loginIN(postLogin): Observable<any> {
    return this._http.post(this.actionURI+'UserAuth', postLogin)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      );
  }
  //time sheet submittion page
  postSheet(finalRequest): Observable<any> {
    //alert(JSON.stringify(finalRequest));
    return this._http.post(this.actionURI+'AddSubmitTimeSheet', finalRequest)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      )
  }
  //timesheets approval & rejection
  approvets(approveObject): Observable<any> {
    //console.log(approveObject);
    return this._http.post(this.actionURI+'TimeSheetManagerActions', approveObject)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      )
  }
  rejectts(rejectObject): Observable<any> {
    //console.log(rejectObject);
    return this._http.post(this.actionURI+'TimeSheetManagerActions', rejectObject)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      )
  }
  forgetpwd(forgetObject): Observable<any> {
    //console.log(forgetObject);
    return this._http.post(this.actionURI+'ChangePassword', forgetObject)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      )
  }
  editProfile(editingObject): Observable<any> {
    //console.log(editingObject);
    return this._http.post(this.actionURI+'AddOrEditUserProfileByUser', editingObject)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    //console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return Observable.throw(error || 'Web Api Error');
  }
}
