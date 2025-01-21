import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectTagsListComponent } from './select-tags-list.component';

describe('SelectTagsListComponent', () => {
  let component: SelectTagsListComponent;
  let fixture: ComponentFixture<SelectTagsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectTagsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTagsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
