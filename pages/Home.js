import { useWallet } from "@solana/wallet-adapter-react"
import {React,useState} from 'react'
import { Initialize } from "./Components/Initialize";

const HomeScreen = () => {
  const [TransactionUrl,setTransactionUrl] = useState()
  const [user,setuser] = useState(false) ;

  const handleclick = () =>[
    setuser(!user)
  ]
  return (
    <div className='flex  h-screen w-screen'>
      <div className='w-1/2  p-10 '>
        <div className='flex  flex-col justify-center items-start h-full w-full gap-5'>  <h2 className='break-words text-3xl'>The premier destination for honest and insightful movie reviews! Whether you're a casual viewer or a dedicated cinephile, FlickFinder provides comprehensive reviews to guide your next movie night.
        </h2>
        
            <Initialize setTransactionUrl={setTransactionUrl}/>
      
        </div>

      </div>
      <div className='w-1/2'>
        <div className='h-full w-full flex justify-center items-center' onClick={handleclick}><img src='movie-review.jpeg' width={400} height={400} /></div>
      </div>

    </div>
  )
}

export default HomeScreen