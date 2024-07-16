import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import {React,useState} from 'react'
const HomeScreen = () => {
  const [TransactionUrl,setTransactionUrl] = useState()
  const [user,setuser] = useState(false) ;

  const handleclick = () =>[
    setuser(!user)
  ]
  const wallet = useWallet()
  return (
    <div className='sm:flex   h-screen w-screen justify-center items-center '  >
      <div className="absolute w-full h-full blur-sm z-0 " style={{ backgroundImage: "url('./background.jpg')"}}></div>
      <div className="sm:w-1/2  p-10 w-full" >
        <div className='flex  flex-col justify-center items-start h-full w-full gap-5 z-50 relative'>  <h2 className='break-words text-3xl text-white'>The premier destination for honest and insightful movie reviews! Whether you're a casual viewer or a dedicated cinephile, FlickFinder provides comprehensive reviews to guide your next movie night.
        </h2>
        
       
      
        </div>

      </div>
      <div className='sm:w-1/2 w-full' >
        <div className='h-full w-full flex justify-center items-center z-50 relative ' onClick={handleclick}><img src='movie-review.jpeg' className="md:h-[400px] md:w-[400px] w-[300px] h-[300px]" /></div>
      </div>

    </div>
  )
}

export default HomeScreen