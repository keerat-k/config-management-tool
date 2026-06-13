import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetail } from './workflow-detail';

describe('WorkflowDetail', () => {
  let component: WorkflowDetail;
  let fixture: ComponentFixture<WorkflowDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
