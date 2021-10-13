/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
export const URL_POLL_DEFAULT_DELAY = 15000; // 15 seconds

export const useSafeFetch = () => {
  const controller = useRef<AbortController>();
  useEffect(() => {
    controller.current = new AbortController();
    return () => controller.current.abort();
  }, []);

  return (url) =>
    consoleFetchJSON(url, 'get', { signal: controller.current.signal as AbortSignal });
};

export const usePoll = (callback, delay, ...dependencies) => {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();

    tick(); // Run first tick immediately.

    if (delay) {
      // Only start interval if a delay is provided.
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...dependencies]);
};

export const useURLPoll = <R>(
  url: string,
  delay = URL_POLL_DEFAULT_DELAY,
  ...dependencies: any[]
): URLPoll<R> => {
  const [error, setError] = useState();
  const [response, setResponse] = useState<R>();
  const [loading, setLoading] = useState(true);
  const safeFetch = useSafeFetch();
  const tick = useCallback(() => {
    if (url) {
      safeFetch(url)
        .then((data) => {
          setResponse(data);
          setError(undefined);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError(err);
            setLoading(false);
            // eslint-disable-next-line no-console
            console.error(`Error polling URL: ${err}`);
          }
        });
    } else {
      setLoading(false);
    }
  }, [url]);

  usePoll(tick, delay, ...dependencies);

  return [response, error, loading];
};

export type URLPoll<R> = [R, any, boolean];
