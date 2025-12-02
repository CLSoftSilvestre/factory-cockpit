import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsNewDialogComponent } from './dashboards-new-dialog.component';

describe('DashboardsNewDialogComponent', () => {
  let component: DashboardsNewDialogComponent;
  let fixture: ComponentFixture<DashboardsNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsNewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardsNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
