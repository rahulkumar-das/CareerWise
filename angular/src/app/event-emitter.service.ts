import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  onAlertEvent: EventEmitter<String>= new EventEmitter();
  updateNumberOfFriendRequestsEvent: EventEmitter<string> = new EventEmitter();
  updateSendMessageObjectEvent: EventEmitter<object> = new EventEmitter();
  
  constructor() { }
}
