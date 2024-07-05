type TListener = () => void;

function createStore<TState extends Record<string, unknown>>(
  initialState: TState
) {
  let state = initialState;
  const getSnapshot = () => state;
  const listeners = new Set<TListener>();

  function setState(fn: (prevState: TState) => TState) {
    state = fn(state);

    for (const listener of listeners) {
      listener();
    }
  }

  function subscribe(listener: TListener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return { getSnapshot, setState, subscribe };
}

export default createStore;
