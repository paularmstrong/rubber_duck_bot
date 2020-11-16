import { h, render } from 'preact';
import 'preact/devtools';
import App from './App.js';
import './index.css';
import Bot from './bot';

render(
  <Bot>
    <App />
  </Bot>,
  document.getElementById('root')
);
