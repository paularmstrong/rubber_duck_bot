import { h } from 'preact';
import { BotContext } from './bot';
import { Debug } from './bot/Debug';
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
  const debug = window.location.search.includes('debug');

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
          audioContext={audioContext}
          key={`${userName}-${timestamp}`}
          name={userName}
          size={squeaker ? 'large' : 'mini'}
          squeakBuffer={squeakBuffer}
          volume={1 / Math.pow(1.2, duckies.length)}
        />
      ))}
      {!debug ? null : <Debug />}
    </div>
  );
}

export default App;
