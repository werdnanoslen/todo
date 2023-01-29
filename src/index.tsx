import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const TASKS = [
  { id: 'task-0', data: 'Eat', done: false, pinned: true },
  { id: 'task-1', data: 'Sleep', done: false, pinned: true },
  { id: 'task-2', data: 'Repeat', done: true, pinned: false },
  {
    id: 'task-3',
    data: [
      { id: 'task-3-1', data: 'Eat', done: false },
      { id: 'task-3-2', data: 'Sleep', done: false },
      { id: 'task-3-3', data: 'Repeat', done: true },
    ],
    done: false,
  },
];

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App tasks={TASKS} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();