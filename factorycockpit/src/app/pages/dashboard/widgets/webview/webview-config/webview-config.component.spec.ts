import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebviewConfigComponent } from './webview-config.component';

describe('WebviewConfigComponent', () => {
  let component: WebviewConfigComponent;
  let fixture: ComponentFixture<WebviewConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebviewConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebviewConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
