import React, { Dispatch } from 'react';

type PromiseStatus = 'idle' | 'pending' | 'rejected' | 'resolved';

type ReducerState<T> = {
  status: PromiseStatus;
  data: T | null;
  error: Error | null;
};

type ReducerAction<T> =
  | { type: 'LOADING'; payload: null }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'FAILURE'; payload: Error }
  | { type: 'RESET' };

const useSafeDispatch = <T>(dispatch: Dispatch<ReducerAction<T>>) => {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback((a: ReducerAction<T>) => (mounted.current ? dispatch(a) : void 0), [dispatch]);
};

const createReducer =
  <T>() =>
  (state: ReducerState<T>, action: ReducerAction<T>): ReducerState<T> => {
    switch (action.type) {
      case 'LOADING':
        return {
          ...state,
          status: 'pending',
        };
      case 'SUCCESS':
        return {
          status: 'resolved',
          data: action.payload,
          error: null,
        };
      case 'FAILURE':
        return {
          status: 'rejected',
          error: action.payload,
          data: null,
        };
      case 'RESET':
        return { status: 'idle', data: null, error: null };
      default:
        return state;
    }
  };

const useAsync = <T>() => {
  const Reducer = createReducer<T>();
  const [{ status, data, error }, dispatch] = React.useReducer(Reducer, { status: 'idle', data: null, error: null });

  const safeSetState = useSafeDispatch(dispatch);

  const run = React.useCallback(
    async (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        );
      }
      safeSetState({ type: 'LOADING', payload: null });
      try {
        const resolvedData = await promise;
        safeSetState({ type: 'SUCCESS', payload: resolvedData });
        return resolvedData;
      } catch (err) {
        safeSetState({ type: 'FAILURE', payload: err as Error });
        return err as Error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeSetState],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setData = React.useCallback(
    (dataPayload: T) => safeSetState({ type: 'SUCCESS', payload: dataPayload }),
    [safeSetState],
  );
  const setError = React.useCallback(
    (errorPayload: any) => safeSetState({ type: 'FAILURE', payload: errorPayload }),
    [safeSetState],
  );
  const reset = React.useCallback(() => safeSetState({ type: 'RESET' }), [safeSetState]);

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
};

export default useAsync;
