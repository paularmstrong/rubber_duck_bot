import { h } from 'preact';
import { client, commandMap } from './index';
import { useCallback } from 'preact/hooks';

function Handler({ command }) {
  const handler = useCallback(() => {
    client.emit(
      'message',
      client.opts.channels[0],
      { 'display-name': 'DEBUG', id: Date.now() },
      command,
    );
  }, []);

  return <button onClick={handler}>{command}</button>;
}

export function Debug() {
  return (
    <div>
      {Object.keys(commandMap).map((command, i) => (
        <Handler command={command} key={command} />
      ))}
    </div>
  );
}
