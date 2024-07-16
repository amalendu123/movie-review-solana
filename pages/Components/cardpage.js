import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import axios from 'axios';
import Link from 'next/link';

const Cardpage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const retrieve = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getallmovies');
        setMovies(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    retrieve();
  }, []);

  return (
    <div className='flex p-4'>
      {movies.map((film) => (
        
        <Link key={film.id}  href={`/movie/${film._id.$oid}`}>
          <Cards movie={film}  />
        </Link>
      ))}
    </div>
  );
}

export default Cardpage;
