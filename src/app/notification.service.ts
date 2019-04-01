import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private url = "https://todobackend.sathyainfotechpro.com/api/v1/notification";

  constructor(public http: HttpClient) { }

  public getAllNotification (data: any): Observable<any> {
    return this.http.get(`${this.url}/getAllNotification/${data.userId}?pageNo=${data.pageNo}&authToken=${data.authToken}`);
  }

    public statusNotification(data: any): Observable<any> {
      const params = new HttpParams()
      .set("Id", data.Id)
      return this.http.post(`${this.url}/statusNotification?authToken=${data.authToken}`,params);
    }

    public closedNotification(data: any): Observable<any> {
      const params = new HttpParams()
      .set("Id", data.Id)
      return this.http.post(`${this.url}/closedNotification?authToken=${data.authToken}`,params);
    }

   

    private handleError(err: HttpErrorResponse) {
      let errorMessage = "";
      if (err.error instanceof Error) {
        errorMessage = `An error occurred: ${err.error.message}`;
      } else {
        errorMessage = `Server returned code: ${err.status}, error message is: ${
          err.message
          }`;
      } // end condition *if
      console.error(errorMessage);
      return Observable.throw(errorMessage);
    } // END handleError

}
