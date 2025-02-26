import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssistantDetailsComponent } from './assistant-details.component';


describe('AssistantDetailsComponent', () => {
  let component: AssistantDetailsComponent;
  let fixture: ComponentFixture<AssistantDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssistantDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
