import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PageDynamicHead from './components/head/PageDynamicHead';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <PageDynamicHead />
    
    <App />
  </React.StrictMode>
);

