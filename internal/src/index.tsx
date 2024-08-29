// Import statements
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './components/app/App';
import './index.scss';

// Mounting point
const MOUNT_NODE = document.getElementById('root');

// Create root and render application
const root = createRoot(MOUNT_NODE as Element);
root.render(
    <HashRouter>
        <App />
    </HashRouter>
);
