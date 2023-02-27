import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../src/layout/backup.css'

import { BrowserRouter as Router } from 'react-router-dom';

import '../node_modules/primereact/resources/themes/lara-light-indigo/theme.css';
import "../node_modules/primereact/resources/primereact.min.css";
import "../node_modules/primereact/core/core.js"
import "../node_modules/primereact/toast/toast.cjs"
import '../node_modules/primeicons/primeicons.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';

// import { QueryClient, QueryClientProvider } from 'react-query';
// const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/* <QueryClientProvider client={client}> */}
      <App />
    {/* </QueryClientProvider> */}
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
