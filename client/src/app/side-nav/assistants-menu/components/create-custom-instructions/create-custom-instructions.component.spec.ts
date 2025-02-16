import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateCustomInstructionsComponent } from './create-custom-instructions.component';

describe('CreateCustomInstructionsComponent', () => {
  let component: CreateCustomInstructionsComponent;
  let fixture: ComponentFixture<CreateCustomInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateCustomInstructionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCustomInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
