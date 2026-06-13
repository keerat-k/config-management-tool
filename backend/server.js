const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
let { workflows } = require('./data');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

// GET all workflows
app.get('/api/workflows', (req, res) => {
  const summary = workflows.map(({ steps, ...w }) => ({
    ...w,
    stepCount: steps.length
  }));
  res.json(summary);
});

// GET single workflow with steps
app.get('/api/workflows/:id', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  res.json(wf);
});

// POST create workflow
app.post('/api/workflows', (req, res) => {
  const newWf = {
    id: workflows.length + 1,
    ...req.body,
    steps: []
  };
  workflows.push(newWf);
  res.status(201).json(newWf);
});

// PUT update workflow
app.put('/api/workflows/:id', (req, res) => {
  const idx = workflows.findIndex(w => w.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Workflow not found' });
  workflows[idx] = { ...workflows[idx], ...req.body };
  res.json(workflows[idx]);
});

// DELETE workflow
app.delete('/api/workflows/:id', (req, res) => {
  workflows = workflows.filter(w => w.id !== parseInt(req.params.id));
  res.status(204).send();
});

// GET steps for a workflow
app.get('/api/workflows/:id/steps', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  res.json(wf.steps.sort((a, b) => a.order - b.order));
});

// POST add step
app.post('/api/workflows/:id/steps', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  const newStep = {
    stepId: `S-${String(wf.steps.length + 1).padStart(3, '0')}`,
    order: wf.steps.length + 1,
    ...req.body
  };
  wf.steps.push(newStep);
  res.status(201).json(newStep);
});

// PUT update step
app.put('/api/workflows/:id/steps/:stepId', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  const stepIdx = wf.steps.findIndex(s => s.stepId === req.params.stepId);
  if (stepIdx === -1) return res.status(404).json({ error: 'Step not found' });
  wf.steps[stepIdx] = { ...wf.steps[stepIdx], ...req.body };
  res.json(wf.steps[stepIdx]);
});

// DELETE step
app.delete('/api/workflows/:id/steps/:stepId', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  wf.steps = wf.steps.filter(s => s.stepId !== req.params.stepId);
  res.status(204).send();
});

// PUT reorder steps
app.put('/api/workflows/:id/steps/reorder', (req, res) => {
  const wf = workflows.find(w => w.id === parseInt(req.params.id));
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  const { orderedStepIds } = req.body;
  orderedStepIds.forEach((stepId, idx) => {
    const step = wf.steps.find(s => s.stepId === stepId);
    if (step) step.order = idx + 1;
  });
  res.json(wf.steps.sort((a, b) => a.order - b.order));
});

app.listen(PORT, () => {
  console.log(`Config Management API running on http://localhost:${PORT}`);
  console.log(`Swagger-style endpoints:`);
  console.log(`  GET    /api/workflows`);
  console.log(`  GET    /api/workflows/:id`);
  console.log(`  POST   /api/workflows`);
  console.log(`  PUT    /api/workflows/:id`);
  console.log(`  DELETE /api/workflows/:id`);
  console.log(`  GET    /api/workflows/:id/steps`);
  console.log(`  POST   /api/workflows/:id/steps`);
  console.log(`  PUT    /api/workflows/:id/steps/:stepId`);
  console.log(`  DELETE /api/workflows/:id/steps/:stepId`);
  console.log(`  PUT    /api/workflows/:id/steps/reorder`);
});
