import { Routes } from '@angular/router';
import { WorkflowListComponent } from './components/workflow-list/workflow-list';
import { WorkflowDetail } from './components/workflow-detail/workflow-detail';
import { Documentation } from './components/documentation/documentation';

export const routes: Routes = [
  { path: '', redirectTo: 'workflows', pathMatch: 'full' },
  { path: 'workflows', component: WorkflowListComponent },
  { path: 'workflows/:id', component: WorkflowDetail },
  { path: 'documentation', component: Documentation }
];
