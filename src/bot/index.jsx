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
  const { 'display-name': userName, id } = context;
  dispatch({ type: 'add_ducky', payload: { timestamp, userName, id } });
  setTimeout(() => {
    dispatch({ type: 'remove_ducky', payload: { timestamp, userName, id } });
  }, 5000);
}

export const commandMap = {
  '!ducky': showDucky,
  '!hello': sayHello,
  '!help': showCommands,
};

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
      const { id } = action.payload;
      return {
        ...state,
        duckies: state.duckies.filter((ducky) => ducky.id !== id),
      };
    }
    default:
      return state;
  }
};

export const client = new tmi.client({
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
