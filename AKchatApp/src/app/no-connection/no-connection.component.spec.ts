import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoConnectionComponent } from './no-connection.component';

describe('NoConnectionComponent', () => {
  let component: NoConnectionComponent;
  let fixture: ComponentFixture<NoConnectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoConnectionComponent]
    });
    fixture = TestBed.createComponent(NoConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
