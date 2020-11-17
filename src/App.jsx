import { h } from 'preact';
import { BotContext } from './bot';
import Ducky from './Ducky';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
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
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (duckies.length && duckies[duckies.length - 1].squeaker) {
      const source = audioContext.createBufferSource();
      source.buffer = squeakBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }, [duckies]);

  const interactionHandler = useCallback(() => {
    setInteracted(true);
  }, [setInteracted]);

  return (
    <div className="app">
      {interacted ? null : (
        <button className="interact-button" onClick={interactionHandler}>
          Start up
        </button>
      )}
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
