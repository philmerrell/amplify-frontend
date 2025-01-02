import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConversationsMenuComponent } from './conversations-menu.component';

describe('ConversationsMenuComponent', () => {
  let component: ConversationsMenuComponent;
  let fixture: ComponentFixture<ConversationsMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConversationsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
