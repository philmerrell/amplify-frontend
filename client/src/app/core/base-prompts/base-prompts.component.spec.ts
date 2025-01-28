import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasePromptsComponent } from './base-prompts.component';

describe('BasePromptsComponent', () => {
  let component: BasePromptsComponent;
  let fixture: ComponentFixture<BasePromptsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BasePromptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasePromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
