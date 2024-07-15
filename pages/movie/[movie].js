import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import idl from "../../idl.json";

const PROGRAM_ID = new anchor.web3.PublicKey('78keQQig26gsHzLf3Wny9K1a3HF7hFKexiZj3WYyqkNB');

const Movie = () => {
  const [film, setFilm] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { movie } = router.query;

  useEffect(() => {
    const getMovie = async () => {
      if (!movie) return;

      try {
        const response = await axios.get('http://localhost:8080/getallmovies');
        const movieData = response.data.find((mov) => mov._id.$oid === movie);
        setFilm(movieData);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to load movie data');
      }
    };

    getMovie();
  }, [movie]);

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
  
      await program.methods.instructionOne(
        film.Movie_title,
        reviewText
      )
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
    } catch (error) {
      console.error('Error posting review:', error);
      setError('Failed to post review');
    }
  };

  if (!film) return <div>Loading...</div>;

  return (
    <div className='w-screen h-screen flex'>
      <div className='w-1/2 flex flex-col justify-center items-start p-4'>
        <Image src={`/${film.img_link}`} className='h-96 w-96' width={384} height={384} alt='poster'/>
        <div>
          <h1 className='text-4xl'>{film.Movie_title}</h1>
          <h2 className='text-2xl'>{film.Description}</h2>
          <h3>IMDb: {film.imdb}</h3>
        </div>
      </div>
      <div className='w-1/2 flex justify-center items-center'>
        <div className='flex flex-col justify-between'>
          <h1>Review</h1>
          <div className='flex flex-col gap-2'>
            <textarea
              placeholder='Enter your review'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className='p-2 border rounded'
            />
            <button className='p-2 bg-red-500 text-white rounded' onClick={postReview}>
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