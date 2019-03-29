import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagiComponent } from './pagi.component';

describe('PagiComponent', () => {
  let component: PagiComponent;
  let fixture: ComponentFixture<PagiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
