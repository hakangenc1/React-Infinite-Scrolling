import React, { useState, useRef, useCallback } from 'react';
import usePersonSearch from './usePersonSearch';

import './App.scss';
import Spinner from './Spinner';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { person, loading, hasMore, error } = usePersonSearch(
    query,
    pageNumber
  );

  const observer = useRef();
  const lastPersonElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevState => prevState + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = e => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <input
        className='search-input'
        type='text'
        placeholder='Search person'
        value={query}
        name='search'
        onChange={handleSearch}
      />
      {person.map((e, i) => {
        // if (person.length === i + 1) {
        //   return (
        //     <div className='person-list' key={i} ref={lastPersonElementRef}>
        //       {e.name}
        //     </div>
        //   );
        // }
        // return (
        //   <div className='person-list' key={i}>
        //     {e.name}
        //   </div>
        // );
        return (
          <div
            className='person-list'
            {...(person.length === i + 1
              ? { ref: lastPersonElementRef }
              : null)}
            key={i}
          >
            {e.name}
          </div>
        );
      })}
      {loading && <Spinner />}
      {error && <div>Error!</div>}
    </div>
  );
}

export default App;
