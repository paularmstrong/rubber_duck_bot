import { h } from 'preact';
import ducky from './ducky.svg';
import { useState } from 'preact/hooks';
import './Ducky.css';

export default function Ducky({ name, size }) {
  const [leftPos] = useState(
    size === 'large' ? 10 : Math.floor(Math.min(Math.random() * 300)),
  );
  const [width] = useState(
    size === 'large' ? 200 : Math.floor(Math.max(Math.random() * 75, 40)),
  );

  return (
    <div
      className={`ducky ducky-${size}`}
      style={size === 'large' ? {} : { left: `${leftPos}px` }}
    >
      <img
        src={ducky}
        className="ducky-img"
        alt={`ducky for ${name}`}
        style={{
          width: `${width}px`,
        }}
      />
      {name}
    </div>
  );
}
