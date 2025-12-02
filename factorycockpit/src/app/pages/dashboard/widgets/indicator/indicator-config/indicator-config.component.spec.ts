import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorConfigComponent } from './indicator-config.component';

describe('IndicatorConfigComponent', () => {
  let component: IndicatorConfigComponent;
  let fixture: ComponentFixture<IndicatorConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
