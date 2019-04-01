import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject(1);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(countUnreadMsg: number) {
    this.messageSource.next(countUnreadMsg)
  }

}