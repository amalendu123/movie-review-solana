import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import idl from '../../idl.json';
import { People, Person } from '@mui/icons-material';

const PROGRAM_ID = new anchor.web3.PublicKey('78keQQig26gsHzLf3Wny9K1a3HF7hFKexiZj3WYyqkNB');

const Movie = () => {
  const [film, setFilm] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [review, setReview] = useState([]);
  const { movie } = router.query;

  useEffect(() => {
    const getMovie = async () => {
      if (!movie) return;

      try {
        const response = await axios.get('https://backend2.shuttleapp.rs/getallmovies');
        const movieData = response.data.find((mov) => mov._id.$oid === movie);
        setFilm(movieData);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to load movie data');
      }
    };

    getMovie();
  }, [movie]);

  useEffect(() => {
    const getReview = async () => {
      if (!wallet) {
        setError('Please connect your wallet');
        return;
      }
      if (!film) {
        setError('Movie data not loaded');
        return;
      }

      try {
        const provider = new anchor.AnchorProvider(connection, wallet, {});
        const program = new anchor.Program(idl, PROGRAM_ID, provider);
        const movieReviews = await program.account.movieStruct.all();

        const matchingReviews = movieReviews.filter(
          (review) => review.account.movieName === film.Movie_title
        );

        if (matchingReviews.length > 0) {
          setReview(matchingReviews);
        } else {
          setReview([]);
        }

        console.log(matchingReviews);
      } catch (error) {
        console.error('Error fetching movie reviews:', error);
      }
    };

    if (film) {
      getReview();
    }
  }, [film, wallet, connection]);

  const postReview = async () => {
    if (!wallet) {
      setError('Please connect your wallet');
      return;
    }
    if (!film) {
      setError('Movie data not loaded');
      return;
    }
    if (reviewText.trim().length === 0) {
      setError('Please enter a review');
      return;
    }

    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {});
      const program = new anchor.Program(idl, PROGRAM_ID, provider);
      const review = anchor.web3.Keypair.generate();

      await program.methods
        .instructionOne(film.Movie_title, reviewText)
        .accounts({
          accountName: review.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([review])
        .rpc();

      console.log('Review posted successfully!');
      setReviewText('');
      setError('');
      // Refresh reviews after posting
      const movieReviews = await program.account.movieStruct.all();
      const matchingReviews = movieReviews.filter(
        (review) => review.account.movieName === film.Movie_title
      );
      setReview(matchingReviews);
    } catch (error) {
      console.error('Error posting review:', error);
      setError('Failed to post review');
    }
  };

  if (!film) return <div>Loading...</div>;

  return (
    <div className='w-screen h-screen md:flex bg-slate-400'>
      <div className='md:w-1/2 flex flex-col justify-center md:items-start items-center p-4  '>
        <Image src={`/${film.img_link}`} className='h-96 w-80' width={384} height={384} alt='poster' />
        <div>
          <h1 className='text-4xl'>{film.Movie_title}</h1>
          <h2 className='text-2xl'>{film.Description}</h2>
          <h3>IMDb: {film.imdb}</h3>
        </div>
      </div>
      <div className='md:w-1/2 flex justify-center items-center sm:w-full p-2 bg-slate-400 '>
        <div className='flex flex-col justify-between border-solid border-2 border-black p-2  2xl:w-[800px] xl:w-[600px] lg:w-[530px] md:w-[400px] w-full '>
          <h1 className='text-4xl'>Review</h1>
          <div className='flex flex-col'>
            {review.map((r, index) => (
              <div key={index} className='flex flex-col '>
                <div className='flex items-center gap-5 text-xl'>
                  <Person />
                  <span ><p className='break-words lg:w-[450px] md:w-[300px]'>{r.account.reviewer.toBase58()}</p></span>
                </div>
                <div className='ml-10'>
                  <h2 className='font-light'>{r.account.review}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            <textarea
              placeholder='Enter your review'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className='p-2 border rounded w-full'
            />
            <button className='p-2 bg-red-500 text-white rounded w-full' onClick={postReview}>
              Post Review
            </button>
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
