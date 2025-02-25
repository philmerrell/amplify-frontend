import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateAssistantModalComponent } from './create-assistant-modal.component';

describe('CreateAssistantModalComponent', () => {
  let component: CreateAssistantModalComponent;
  let fixture: ComponentFixture<CreateAssistantModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateAssistantModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAssistantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
