import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const Movie = () => {
  const router = useRouter();
  const { movie } = router.query;
  const [film, setFilm] = useState(null); 

  useEffect(() => {
    const getMovie = async () => {
      if (!movie) return; 

      try {
        const response = await axios.get('http://localhost:8080/getallmovies');
        const movieData = response.data.find((mov) => mov._id.$oid === movie);
        setFilm(movieData);
      } catch (error) {
        console.error(error);
      }
    };

    getMovie();
  }, [movie]); 

  return (
    <div>
      {film ? film._id.$oid : 'Loading...'}
    </div>
  );
};

export default Movie;
