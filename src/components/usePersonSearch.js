import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePersonSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [person, setPerson] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setPerson([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios
      .get(`http://localhost:9000/users?q=${query}&_page=${pageNumber}&_limit=10`, {
        cancelToken: new axios.CancelToken(c => (cancel = c))
      })
      .then(res => {
        setPerson(prevState => {
          return [...new Set([...prevState, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch(err => {
        if (axios.isCancel(err)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, person, hasMore };
}
