import tmi from 'tmi.js';
import { createContext, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

// Create a client with our options
function sayHello(client, channel, context, state, setState) {
  client.say(channel, `Hello ${context['display-name']}!`);
}

function showCommands(client, channel, context, state, setState) {
  client.say(
    channel,
    `Available commands: ${Object.keys(commandMap).join(', ')}`,
  );
}

function showDucky(client, channel, context, state, setState) {
  if (state.showDucky) {
    return;
  }

  const now = Date.now();
  const cooldown = now - state.lastDuckyShowTimestamp;
  if (cooldown < 30000) {
    client.say(
      channel,
      `Waiting ${Math.floor(
        (30000 - cooldown) / 1000,
      )} seconds before squeaking again.`,
    );
    return;
  }

  setState({ ...state, lastDuckyShowTimestamp: now, showDucky: true });
  setTimeout(() => {
    setState({ ...state, lastDuckyShowTimestamp: now, showDucky: false });
  }, 2000);
}

const commandMap = {
  '!ducky': showDucky,
  '!hello': sayHello,
  '!help': showCommands,
};

// // Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

const client = new tmi.client({
  identity: {
    username: import.meta.env.SNOWPACK_PUBLIC_USERNAME,
    password: import.meta.env.SNOWPACK_PUBLIC_PASSWORD,
  },
  channels: [import.meta.env.SNOWPACK_PUBLIC_CHANNEL],
});

export const BotContext = createContext({});

export default function Bot({ children }) {
  const [state, setState] = useState({
    lastDuckyShowTimestamp: undefined,
    showDucky: false,
  });

  useEffect(() => {
    client.on('connected', onConnectedHandler);
    client.connect();

    return () => {
      client.disconnect();
    };
  }, []);

  const handleMessage = useCallback(
    (target, context, msg, isSelf) => {
      if (isSelf) {
        return;
      }
      const commandName = msg.trim();
      if (!(commandName in commandMap)) {
        return;
      }

      commandMap[commandName](client, target, context, state, setState);
    },
    [client, state, setState],
  );
  client.removeAllListeners('message');
  client.on('message', handleMessage);

  return <BotContext.Provider value={state}>{children}</BotContext.Provider>;
}
