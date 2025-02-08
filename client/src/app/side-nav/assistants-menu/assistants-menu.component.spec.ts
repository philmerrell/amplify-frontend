import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistantsMenuComponent } from './assistants-menu.component';

describe('AssistantsMenuComponent', () => {
  let component: AssistantsMenuComponent;
  let fixture: ComponentFixture<AssistantsMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssistantsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
