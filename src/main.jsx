import React from 'react';
import { createRoot } from 'react-dom/client';
import NganyaElitesApp from './App.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NganyaElitesApp />
  </React.StrictMode>
);
