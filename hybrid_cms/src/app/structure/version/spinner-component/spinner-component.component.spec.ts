import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponentComponent } from './spinner-component.component';

describe('SpinnerComponentComponent', () => {
  let component: SpinnerComponentComponent;
  let fixture: ComponentFixture<SpinnerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
