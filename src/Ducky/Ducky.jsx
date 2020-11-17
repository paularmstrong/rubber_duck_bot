import { h } from 'preact';
import ducky from './ducky.svg';
import { useEffect, useState } from 'preact/hooks';
import './Ducky.css';

export default function Ducky({
  audioContext,
  name,
  size,
  squeakBuffer,
  volume,
}) {
  const [leftPos] = useState(
    size === 'large' ? 1 : Math.floor(Math.min(Math.random() * 50)),
  );
  const [width] = useState(Math.max(200 * volume, 50));
  const [hasPlayed, setPlayed] = useState(false);

  useEffect(() => {
    if (hasPlayed) {
      return;
    }
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    gain.gain.value = volume;
    gain.connect(audioContext.destination);
    source.buffer = squeakBuffer;
    source.connect(gain);
    source.start();
    setPlayed(true);
    return () => {};
  }, [audioContext, squeakBuffer, volume, hasPlayed]);

  return (
    <div
      className={`ducky ducky-${size}`}
      style={size === 'large' ? {} : { left: `${leftPos}%` }}
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
