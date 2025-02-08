import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatePromptTemplateComponent } from './create-prompt-template.component';

describe('CreatePromptTemplateComponent', () => {
  let component: CreatePromptTemplateComponent;
  let fixture: ComponentFixture<CreatePromptTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreatePromptTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePromptTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
