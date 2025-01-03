import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsPermitsComponent } from './visitors-permits.component';

describe('VisitorsPermitsComponent', () => {
  let component: VisitorsPermitsComponent;
  let fixture: ComponentFixture<VisitorsPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorsPermitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorsPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
