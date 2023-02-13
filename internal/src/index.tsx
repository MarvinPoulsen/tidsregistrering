import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './components/app/App';
import './index.scss';

const MOUNT_NODE = document.getElementById('root');
const root = createRoot(MOUNT_NODE);
root.render(
    <HashRouter>
        <App />
    </HashRouter>);