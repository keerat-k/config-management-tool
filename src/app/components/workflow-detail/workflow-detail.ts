import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService, Workflow, Step } from '../../services/workflow';
import { StepModal } from '../step-modal/step-modal';

@Component({
  selector: 'app-workflow-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, StepModal],
  templateUrl: './workflow-detail.html',
  styleUrl: './workflow-detail.scss'
})
export class WorkflowDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workflowService = inject(WorkflowService);
  private cdr = inject(ChangeDetectorRef);

  workflow: Workflow | null = null;
  steps: Step[] = [];
  selectedStep: Step | null = null;
  loading = true;
  error = '';

  showDataset2 = false;
  showOutputParams = false;
  showAdditionalInfo = false;

  showModal = false;
  editingStep: Step | null = null;

  draggedIndex: number | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.workflowService.getWorkflow(id).subscribe({
      next: (data) => {
        this.workflow = data;
        this.steps = [...(data.steps || [])].sort((a, b) => a.order - b.order);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not load workflow.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/workflows']);
  }

  selectStep(step: Step) {
    this.selectedStep = this.selectedStep?.stepId === step.stepId ? null : step;
  }

  deleteStep() {
    if (!this.selectedStep || !this.workflow) return;
    this.workflowService.deleteStep(this.workflow.id, this.selectedStep.stepId).subscribe({
      next: () => {
        this.steps = this.steps.filter(s => s.stepId !== this.selectedStep!.stepId);
        this.selectedStep = null;
        this.cdr.detectChanges();
      }
    });
  }

  duplicateStep() {
    if (!this.selectedStep || !this.workflow) return;
    const copy = { ...this.selectedStep, stepId: undefined, stepName: this.selectedStep.stepName + ' (Copy)' };
    this.workflowService.addStep(this.workflow.id, copy).subscribe({
      next: (newStep) => {
        this.steps = [...this.steps, newStep];
        this.cdr.detectChanges();
      }
    });
  }

  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
  }

  onDrop(index: number) {
    if (this.draggedIndex === null || this.draggedIndex === index) return;
    const reordered = [...this.steps];
    const [moved] = reordered.splice(this.draggedIndex, 1);
    reordered.splice(index, 0, moved);
    this.steps = reordered;
    this.draggedIndex = null;
    if (this.workflow) {
      this.workflowService.reorderSteps(this.workflow.id, reordered.map(s => s.stepId)).subscribe();
    }
    this.cdr.detectChanges();
  }

  getOperationClass(op: string): string {
    const map: Record<string, string> = {
      'Ingest': 'op-ingest',
      'AddCol': 'op-addcol',
      'RenameCol': 'op-renamecol',
      'Join': 'op-join'
    };
    return map[op] || '';
  }

  openAddStep() {
    this.editingStep = null;
    this.showModal = true;
  }

  openEditStep() {
    this.editingStep = this.selectedStep;
    this.showModal = true;
  }

  onModalSaved(step: Step) {
    if (this.editingStep) {
      this.steps = this.steps.map(s => s.stepId === step.stepId ? step : s);
    } else {
      this.steps = [...this.steps, step];
    }
    this.showModal = false;
    this.selectedStep = null;
    this.cdr.detectChanges();
  }

  onModalClosed() {
    this.showModal = false;
    this.cdr.detectChanges();
  }
}
