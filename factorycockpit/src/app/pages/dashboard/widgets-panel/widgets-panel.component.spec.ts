import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsPanelComponent } from './widgets-panel.component';

describe('WidgetsPanelComponent', () => {
  let component: WidgetsPanelComponent;
  let fixture: ComponentFixture<WidgetsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
