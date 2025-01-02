import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareMenuComponent } from './share-menu.component';

describe('ShareMenuComponent', () => {
  let component: ShareMenuComponent;
  let fixture: ComponentFixture<ShareMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ShareMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
