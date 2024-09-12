import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseFetchOptions extends RequestInit {
  autoInvoke?: boolean;
}

const defaultOptions: UseFetchOptions = {
  autoInvoke: true,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const useFetch = <T, TBody = unknown>(
  url: string,
  options: UseFetchOptions = defaultOptions,
) => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortController = useRef<AbortController | undefined>();

  const fetchOptions = useMemo(() => {
    const { autoInvoke, ...rest } = options;

    return rest;
  }, [options]);

  const makeRequest = useCallback(
    (data?: TBody) => {
      setIsLoading(true);
      setIsError(false);
      abortController.current?.abort();
      abortController.current = new AbortController();

      return fetch(url, {
        signal: abortController.current.signal,
        body: data ? JSON.stringify(data) : undefined,
        ...fetchOptions,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Something went wrong");
          }

          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
            return;
          }

          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [url, fetchOptions],
  );

  const mutation = useCallback(
    async (body?: TBody) => {
      return makeRequest(body);
    },
    [makeRequest],
  );

  useEffect(() => {
    if (options.autoInvoke) {
      makeRequest();
    }

    return () => {
      abortController.current?.abort();
    };
  }, [url]);

  return useMemo(
    () => ({ data, isLoading, isError, refetch: makeRequest, mutation }),
    [data, isLoading, isError, makeRequest, mutation],
  );
};
