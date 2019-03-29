import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripPackagesComponent } from './strip-packages.component';

describe('StripPackagesComponent', () => {
  let component: StripPackagesComponent;
  let fixture: ComponentFixture<StripPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
