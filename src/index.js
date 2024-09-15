import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HashRouter><App /></HashRouter>
);

// 降低版本时
// ReactDOM.render(<App />, document.getElementById('root'));
