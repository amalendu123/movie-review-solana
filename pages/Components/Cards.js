import { Router } from 'next/router'
import React from 'react'

const Cards = ({movie}) => {
  return (
    <div className='h-80 w-56 ' >
        <div className='flex flex-col p-2'>
            <div>
                <img src={movie?.img_link} className='w-full h-3/4 ' />
            </div>
            <div className='flex justify-center items-center'>
                <h2 className='text-2xl'>{movie?.Movie_title}</h2>
            </div>
        </div>
    </div>
  )
}

export default Cards