import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IihAssetsBrowserComponent } from './iih-assets-browser.component';

describe('IihAssetsBrowserComponent', () => {
  let component: IihAssetsBrowserComponent;
  let fixture: ComponentFixture<IihAssetsBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IihAssetsBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IihAssetsBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
