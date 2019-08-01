import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWrapComponent } from './app-wrap.component';

describe('AppWrapComponent', () => {
  let component: AppWrapComponent;
  let fixture: ComponentFixture<AppWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
