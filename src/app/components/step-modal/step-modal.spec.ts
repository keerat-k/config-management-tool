import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepModal } from './step-modal';

describe('StepModal', () => {
  let component: StepModal;
  let fixture: ComponentFixture<StepModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StepModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
