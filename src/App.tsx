import { memo, useState } from "react";
import { useFetch } from "./hooks/useFetch.ts";

type Post = {
  id: number;
  title: string;
};

function App() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);

  const data = useFetch<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`,
  );

  return (
    <div>
      <h1>React fetch api</h1>
      <button onClick={() => setCount((p) => p + 1)}>{count}</button>
      <Comp {...data} />
    </div>
  );
}

const Comp = memo(
  (props: {
    data?: Post[];
    isError: boolean;
    isLoading: boolean;
    refetch: () => void;
  }) => {
    const { data, isError, isLoading, refetch } = props;

    console.log("render");

    return (
      <div>
        <button onClick={() => refetch()}>Refetch</button>

        {isLoading && <p>Loading...</p>}

        {isError && <p>Something went wrong</p>}

        {!isLoading && !isError && (
          <ul>{data?.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
        )}
      </div>
    );
  },
);

export default App;
