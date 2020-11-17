import tmi from 'tmi.js';
import { createContext, h } from 'preact';
import { useCallback, useEffect, useReducer } from 'preact/hooks';

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

function showDucky(client, channel, context, state, dispatch) {
  const timestamp = Date.now();
  const userName = context['display-name'];
  dispatch({ type: 'add_ducky', payload: { timestamp, userName } });
  setTimeout(() => {
    dispatch({ type: 'remove_ducky', payload: { timestamp, userName } });
  }, 5000);
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

const reducer = (state, action) => {
  switch (action.type) {
    case 'add_ducky': {
      const now = Date.now();
      const squeaker = now - state.lastSqueakTime >= 30000;
      return {
        ...state,
        lastSqueakTime: squeaker ? now : state.lastSqueakTime,
        duckies: [...state.duckies, { ...action.payload, squeaker }],
      };
    }
    case 'remove_ducky': {
      const { timestamp } = action.payload;
      const duckies = state.duckies.filter((ducky) => {
        return ducky.timestamp !== timestamp;
      });
      return {
        ...state,
        duckies,
      };
    }
    default:
      return state;
  }
};

const client = new tmi.client({
  identity: {
    username: import.meta.env.SNOWPACK_PUBLIC_USERNAME,
    password: import.meta.env.SNOWPACK_PUBLIC_PASSWORD,
  },
  channels: [import.meta.env.SNOWPACK_PUBLIC_CHANNEL],
});

const initialState = {
  lastSqueakTime: 0,
  duckies: [],
};
export const BotContext = createContext({});

export default function Bot({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

      commandMap[commandName](client, target, context, state, dispatch);
    },
    [client, state, dispatch],
  );
  client.removeAllListeners('message');
  client.on('message', handleMessage);

  return <BotContext.Provider value={state}>{children}</BotContext.Provider>;
}
