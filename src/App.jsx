import { h } from 'preact';
import { BotContext } from './bot';
import ducky from './ducky.svg';
import { useContext, useEffect } from 'preact/hooks';
import './App.css';

const audioContext = new AudioContext();
let squeakBuffer;

function App() {
  const { showDucky } = useContext(BotContext);

  if (!squeakBuffer) {
    // useEffect(() => {
    fetch('/squeak.m4a')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        squeakBuffer = audioBuffer;
      });
    // }, []);
  }

  useEffect(() => {
    if (showDucky) {
      const source = audioContext.createBufferSource();
      source.buffer = squeakBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }, [showDucky]);

  return (
    <div className="App">
      {showDucky ? (
        <div>
          <img src={ducky} className="Ducky" alt="logo" />
        </div>
      ) : null}
    </div>
  );
}

export default App;
