import { Injectable } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  readonly API = environment.api;
  ws: any;

  private response = new Subject<any>();
  public responseEvent = this.response.asObservable();

  constructor() { }

  emitMessageEvent(newMessage: string): void {
    this.response.next(newMessage);
  }

  connect(): void {

    const socket = new SockJS(this.API.stomp);
    this.ws = Stomp.over(socket);
    const that = this;

    this.ws.connect({}, () => {
      that.ws.subscribe('/errors', message => {
        alert('Error ' + message.body);
      });
      that.ws.subscribe('/topic/greetings', message => {
        this.emitMessageEvent(message.body);
      });
    }, (error) => {
      alert('STOMP error ' + error);
    });
  }

  disconnect(): void {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    console.log('Disconnected');
  }

  sendName(name: string): void {
    const data = JSON.stringify({
      name
    });
    this.ws.send('/app/hello', {}, data);
  }

}
