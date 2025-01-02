import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportConversationsPage } from './import-conversations.page';

describe('ImportConversationsPage', () => {
  let component: ImportConversationsPage;
  let fixture: ComponentFixture<ImportConversationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportConversationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
