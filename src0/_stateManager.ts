// https://zenn.dev/midorimici/articles/simple-state-manager
export type State<T> = { key: string; dflt: T | null };

type SetState<T> = (newState: T) => void;

type UseStateReturnType<T> = [T, SetState<T>];

/** すべての state を格納する Map */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const states: Map<string, any> = new Map();

const generateRandomKey = () => String(Math.random()).slice(-10);

/** state を初期化する */
export const createState = <T>(dflt: T | null = null): State<T> => {
  let key = generateRandomKey();
  while (states.has(key)) {
    key = generateRandomKey();
  }
  states.set(key, dflt);
  return { key, dflt };
};

export const useValue = <T>(state: State<T>): T => {
  return states.get(state.key);
};

export const useSetState = <T>(state: State<T>): SetState<T> => {
  return (newState: T) => {
    states.set(state.key, newState);
  };
};

export const useState = <T>(state: State<T>): UseStateReturnType<T> => [
  useValue(state),
  useSetState(state),
];
