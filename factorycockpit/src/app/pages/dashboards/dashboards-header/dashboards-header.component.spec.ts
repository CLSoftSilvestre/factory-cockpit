import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsHeaderComponent } from './dashboards-header.component';

describe('DashboardsHeaderComponent', () => {
  let component: DashboardsHeaderComponent;
  let fixture: ComponentFixture<DashboardsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
