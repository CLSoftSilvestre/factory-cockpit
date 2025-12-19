import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsDeleteDialogComponent } from './dashboards-delete-dialog.component';

describe('DashboardsDeleteDialogComponent', () => {
  let component: DashboardsDeleteDialogComponent;
  let fixture: ComponentFixture<DashboardsDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardsDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
