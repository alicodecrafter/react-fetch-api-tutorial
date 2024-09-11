import { useEffect, useRef, useState } from 'react';


function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const abortController = useRef<AbortController | undefined>();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        abortController.current?.abort();
        abortController.current = new AbortController();
        setIsError(false);
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`, {
          signal: abortController.current.signal
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        setData(data);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return
        }

        setIsError(true);
      }

      setIsLoading(false);
    }

    getData();
  }, [page]);

  return (
    <div>
      <h1>React fetch api</h1>
      <button onClick={() => setPage(page + 1)}>Next page</button>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Something went wrong</p>}

      {!isLoading && !isError && <ul>
        {data.map((item: any) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>}
    </div>
  )
}

export default App
