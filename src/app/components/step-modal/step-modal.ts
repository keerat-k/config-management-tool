import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService, Step } from '../../services/workflow';

@Component({
  selector: 'app-step-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-modal.html',
  styleUrl: './step-modal.scss'
})
export class StepModal implements OnInit {
  @Input() workflowId!: number;
  @Input() existingStep: Step | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Step>();

  private workflowService = inject(WorkflowService);

  dataOperations = ['Ingest', 'AddCol', 'RenameCol', 'Join'];

  form = {
    stepName: '',
    dataOperation: 'Ingest',
    dataset: '',
    dataset1Name: '',
    dataset2Name: '',
    outputParameters: '',
    operationSpecificInfo: ''
  };

  get isEdit(): boolean {
    return !!this.existingStep;
  }

  ngOnInit() {
    if (this.existingStep) {
      this.form = {
        stepName: this.existingStep.stepName,
        dataOperation: this.existingStep.dataOperation,
        dataset: this.existingStep.dataset,
        dataset1Name: this.existingStep.dataset1Name,
        dataset2Name: this.existingStep.dataset2Name || '',
        outputParameters: this.existingStep.outputParameters || '',
        operationSpecificInfo: this.existingStep.operationSpecificInfo
      };
    }
  }

  save() {
    if (!this.form.stepName || !this.form.dataset || !this.form.dataset1Name) return;
    const payload: Partial<Step> = {
      ...this.form,
      dataOperation: this.form.dataOperation as Step['dataOperation'],
      dataset2Name: this.form.dataset2Name || null,
      outputParameters: this.form.outputParameters || null
    };
    if (this.isEdit && this.existingStep) {
      this.workflowService.updateStep(this.workflowId, this.existingStep.stepId, payload).subscribe({
        next: (step) => this.saved.emit(step)
      });
    } else {
      this.workflowService.addStep(this.workflowId, payload).subscribe({
        next: (step) => this.saved.emit(step)
      });
    }
  }

  close() {
    this.closed.emit();
  }
}
