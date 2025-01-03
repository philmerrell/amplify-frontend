import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkspacesMenuComponent } from './workspaces-menu.component';

describe('WorkspacesMenuComponent', () => {
  let component: WorkspacesMenuComponent;
  let fixture: ComponentFixture<WorkspacesMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WorkspacesMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspacesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
