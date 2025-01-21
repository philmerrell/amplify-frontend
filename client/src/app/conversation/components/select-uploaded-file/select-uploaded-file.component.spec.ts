import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectUploadedFileComponent } from './select-uploaded-file.component';

describe('SelectUploadedFileComponent', () => {
  let component: SelectUploadedFileComponent;
  let fixture: ComponentFixture<SelectUploadedFileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectUploadedFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUploadedFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
