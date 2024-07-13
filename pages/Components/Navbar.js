import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
const Navbar = () => {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  
  return (
    <div className="flex justify-end items-center p-4">
      {isClient ? <WalletMultiButton ></WalletMultiButton> : <></>}
    </div>
  );
};

export default Navbar;
