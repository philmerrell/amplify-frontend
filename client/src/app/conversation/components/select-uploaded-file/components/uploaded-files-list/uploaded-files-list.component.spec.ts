import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadedFilesListComponent } from './uploaded-files-list.component';

describe('UploadedFilesListComponent', () => {
  let component: UploadedFilesListComponent;
  let fixture: ComponentFixture<UploadedFilesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UploadedFilesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadedFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
