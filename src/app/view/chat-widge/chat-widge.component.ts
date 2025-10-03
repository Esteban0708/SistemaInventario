import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatTurn } from 'src/app/model/chat-message.model';
import { ChatService } from 'src/app/service/chat.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-widge',
  templateUrl: './chat-widge.component.html',
  styleUrls: ['./chat-widge.component.css']
})
export class ChatWidgeComponent {
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLDivElement>;

  open = false;
  text = '';
  loading = false;
  sessionId = uuidv4();
  history: ChatTurn[] = [];

  private greeted = false;

  constructor(private chat: ChatService, private router: Router) { }

  toggle() {
    this.open = !this.open;

    if (this.open && !this.greeted) {
      this.history.push({
        role: 'assistant',
        content: 'Hola, soy InvenBot y estoy aquí para ayudarle. ¿En qué puedo asistirle?'
      });
      this.greeted = true;
    }

    setTimeout(() => this.scrollBottom(), 0);
  }

  send() {
    const msg = this.text.trim();
    if (!msg || this.loading) return;

    this.text = '';
    this.history.push({ role: 'user', content: msg });
    this.loading = true;
    this.scrollBottom();

    this.chat.send(msg).then(resp => {
      if (resp.type === 'text') {
        this.history.push({ role: 'assistant', content: resp.text });
      } else if (resp.type === 'navigate') {
        this.history.push({ role: 'assistant', content: resp.text });
        this.router.navigateByUrl(resp.route);
      }
    }).finally(() => {
      this.loading = false;
      this.scrollBottom();
    });
  }

  private scrollBottom() {
    const el = this.scrollArea?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
