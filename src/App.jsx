import { h } from 'preact';
import { BotContext } from './bot';
import Ducky from './Ducky';
import { useContext, useEffect, useState } from 'preact/hooks';
import './App.css';

const audioContext = new AudioContext();
let squeakBuffer;
fetch('/squeak.m4a')
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
  .then((audioBuffer) => {
    squeakBuffer = audioBuffer;
  });

function App() {
  const { duckies } = useContext(BotContext);

  useEffect(() => {
    if (duckies.length && duckies[duckies.length - 1].squeaker) {
      const source = audioContext.createBufferSource();
      source.buffer = squeakBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }, [duckies]);

  return (
    <div className="app">
      {duckies.map(({ userName, squeaker, timestamp }) => (
        <Ducky
          key={`${userName}-${timestamp}`}
          name={userName}
          size={squeaker ? 'large' : 'mini'}
        />
      ))}
    </div>
  );
}

export default App;
