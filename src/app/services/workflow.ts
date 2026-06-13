import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Workflow {
  id: number;
  workflowId: string;
  workflowCategory: string;
  workflowName: string;
  businessUnit: string;
  facility: string;
  payload: string;
  stepCount?: number;
  steps?: Step[];
}

export interface Step {
  stepId: string;
  stepName: string;
  dataOperation: 'Ingest' | 'AddCol' | 'RenameCol' | 'Join';
  dataset: string;
  dataset1Name: string;
  dataset2Name?: string | null;
  outputParameters?: string | null;
  operationSpecificInfo: string;
  order: number;
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.apiUrl}/workflows`);
  }

  getWorkflow(id: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/workflows/${id}`);
  }

  addStep(workflowId: number, step: Partial<Step>): Observable<Step> {
    return this.http.post<Step>(`${this.apiUrl}/workflows/${workflowId}/steps`, step);
  }

  updateStep(workflowId: number, stepId: string, step: Partial<Step>): Observable<Step> {
    return this.http.put<Step>(`${this.apiUrl}/workflows/${workflowId}/steps/${stepId}`, step);
  }

  deleteStep(workflowId: number, stepId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/workflows/${workflowId}/steps/${stepId}`);
  }

  reorderSteps(workflowId: number, orderedStepIds: string[]): Observable<Step[]> {
    return this.http.put<Step[]>(`${this.apiUrl}/workflows/${workflowId}/steps/reorder`, { orderedStepIds });
  }
}
