import tmi from 'tmi.js';
import { createContext, h } from 'preact';
import { useState } from 'preact/hooks';

// Create a client with our options
const client = new tmi.client({
  identity: {
    username: import.meta.env.SNOWPACK_PUBLIC_USERNAME,
    password: import.meta.env.SNOWPACK_PUBLIC_PASSWORD,
  },
  channels: [import.meta.env.SNOWPACK_PUBLIC_CHANNEL],
});

function sayHello(target, context, state, setState) {
  client.say(target, `Hello ${context['display-name']}!`);
}

function showCommands(target, context, state, setState) {
  client.say(
    target,
    `Available commands: ${Object.keys(commandMap).join(', ')}`,
  );
}

function showDucky(target, context, state, setState) {
  setState({ ...state, showDucky: true });
  setTimeout(() => {
    setState({ ...state, showDucky: false });
  }, 3000);
}

const commandMap = {
  '!ducky': showDucky,
  '!hello': sayHello,
  '!help': showCommands,
};

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// // Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

export const BotContext = createContext({});

export default function Bot({ children }) {
  const [state, setState] = useState({
    showDucky: false,
  });
  client.on('message', (target, context, msg, isSelf) => {
    if (isSelf) {
      return;
    }
    const commandName = msg.trim();
    if (!(commandName in commandMap)) {
      return;
    }

    commandMap[commandName](target, context, state, setState);
  });

  return <BotContext.Provider value={state}>{children}</BotContext.Provider>;
}
