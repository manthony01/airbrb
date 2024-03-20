import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

document.querySelector('body').style.margin = '0px';
document.querySelector('body').style.height = '100%';
document.querySelector('body').style.width = '100%';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
