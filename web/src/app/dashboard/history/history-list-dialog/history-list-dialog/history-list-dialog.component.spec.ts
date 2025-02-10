import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryListDialogComponent } from './history-list-dialog.component';

describe('HistoryListDialogComponent', () => {
  let component: HistoryListDialogComponent;
  let fixture: ComponentFixture<HistoryListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
