import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWidgeComponent } from './chat-widge.component';

describe('ChatWidgeComponent', () => {
  let component: ChatWidgeComponent;
  let fixture: ComponentFixture<ChatWidgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatWidgeComponent]
    });
    fixture = TestBed.createComponent(ChatWidgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
