import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomInstructionsComponent } from './custom-instructions.component';

describe('CustomInstructionsComponent', () => {
  let component: CustomInstructionsComponent;
  let fixture: ComponentFixture<CustomInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomInstructionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
