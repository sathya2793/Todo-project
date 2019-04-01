import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
 

  private url = "https://todobackend.sathyainfotechpro.com/api/v1/friends";

  constructor(public http: HttpClient) { }

  public getAllUnFriends(data: any): Observable<any> {
    if(data.query === undefined || data.query === "" || data.query === null)
    {
      return this.http.get(`${this.url}/getAllUnFriends/${data.userId}?pageNo=${data.pageNo}&size=${data.size}`);
    }
    else{
      return this.http.get(`${this.url}/getAllUnFriends/${data.userId}?pageNo=${data.pageNo}&size=${data.size}&query=${data.query}`);
    }
    }

    public getAllRecieved(data: any): Observable<any> {
      return this.http.get(`${this.url}/getAllRecieved/${data.userId}?pageNo=${data.pageNo}&size=${data.size}`);
    }

    public getAllSender(data: any): Observable<any> {
      return this.http.get(`${this.url}/getAllSender/${data.userId}?pageNo=${data.pageNo}&size=${data.size}`);
    }

    public sendRequest(data: any): Observable<any> {
      const params = new HttpParams()
      .set("userId", data.userId)
      .set("friendId", data.friendId)
      .set("status", data.status)
      return this.http.post(`${this.url}/sendRequest?authToken=${data.authToken}` , params);
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
