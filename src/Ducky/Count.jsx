import { h } from 'preact';
import ducky from './duckycount.svg';
import './Ducky.css';

export default function DuckyCount({ count }) {
  return (
    <div class="ducky--count">
      <img src={ducky} />
      {count}
    </div>
  );
}
