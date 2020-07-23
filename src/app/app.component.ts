import { Component, OnInit } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

import { MessageService } from './core/message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'websocket-demo';

  readonly API = environment.api;

  greetings: string[] = [];
  showConversation = false;
  ws: any;
  name: string;
  disabled: boolean;

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.messageService.responseEvent.subscribe(data => {
      this.showGreeting(data);
    });
  }

  connect(): void {
    this.messageService.connect();
    this.setConnected(true);
  }

  disconnect(): void {
    this.messageService.disconnect();
    this.setConnected(false);
  }

  sendName(): void {
    this.messageService.sendName(this.name);
  }

  showGreeting(response: any): void {
    this.showConversation = true;
    const data = JSON.parse(response);
    this.greetings.push(data.content);
  }

  setConnected(connected): void {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }

}
