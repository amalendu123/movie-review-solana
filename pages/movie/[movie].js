import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import Image from 'next/image';

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
        console.log(movieData)
        setFilm(movieData);
      } catch (error) {
        console.error(error);
      }
    };

    getMovie();
  }, [movie]);

  return (
    <div>
      {film ? (
        <div className='w-screen h-screen flex'>
          <div className='w-1/2 flex flex-col justify-center items-start p-4'>
            <Image src={`/${film.img_link}`} className='h-96 w-96 ' width={50} height={100}/>
            <div>
              <h1 className='text-4xl'>{film.Movie_title}</h1>
              <h2 className='text-2xl'> {film.Description}</h2>
              <h3>Imdb:{film.imdb}</h3>
            </div>
          </div>
          <div className='w-1/2 flex justify-center items-center'>
            <div className='flex flex-col justify-between'>
                <div className=''>
                  <h1>Review</h1>
                </div>
                <div className='flex gap-5 '>
                      <input type='text' placeholder='Enter the review' />
                      <button className='p-2 bg-red-500 '> Post</button>
                </div>
            </div>
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default Movie;
