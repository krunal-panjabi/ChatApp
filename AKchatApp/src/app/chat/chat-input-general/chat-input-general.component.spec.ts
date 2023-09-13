import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputGeneralComponent } from './chat-input-general.component';

describe('ChatInputGeneralComponent', () => {
  let component: ChatInputGeneralComponent;
  let fixture: ComponentFixture<ChatInputGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatInputGeneralComponent]
    });
    fixture = TestBed.createComponent(ChatInputGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
