import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkflowService, Workflow } from '../../services/workflow';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.scss'
})
export class WorkflowListComponent implements OnInit {
  private workflowService = inject(WorkflowService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  workflows: Workflow[] = [];
  selectedId: number | null = null;
  loading = true;
  error = '';

  ngOnInit() {
    this.workflowService.getWorkflows().subscribe({
      next: (data) => {
        this.workflows = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Could not load workflows. Is the backend running?';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectRow(id: number) {
    this.selectedId = this.selectedId === id ? null : id;
  }

  openWorkflow(id: number) {
    this.router.navigate(['/workflows', id]);
  }

  goToDocumentation() {
    this.router.navigate(['/documentation']);
  }
}
