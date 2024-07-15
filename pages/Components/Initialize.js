import {
    useConnection,
    useWallet,
    useAnchorWallet,
  } from "@solana/wallet-adapter-react";
  import * as anchor from "@project-serum/anchor";
  import React, { useEffect, useState } from "react";
  import idl from "../../idl.json";

  const PROGRAM_ID = new anchor.web3.PublicKey(
    `78keQQig26gsHzLf3Wny9K1a3HF7hFKexiZj3WYyqkNB`
  );
  
  export const Initialize = ({ setTransactionUrl }) => {
    const [program, setProgram] = useState(null);
    const wallet1 = useWallet()
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
  
    useEffect(() => {
      let provider;
  
      try {
        provider = anchor.getProvider();
      } catch {
        provider = new anchor.AnchorProvider(connection, wallet, {});
        anchor.setProvider(provider);
  
        const programInstance = new anchor.Program(idl, PROGRAM_ID);
        setProgram(programInstance);
      }
    }, [connection, wallet]);
  
    const onClick = async () => {
  
      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
     
    };
  
    return <button  className={`w-fit p-2 rounded-3xl bg-red-500 transition ease-in-out delay-150 ${
      wallet1.connect ? 'opacity-100' : 'opacity-0'
    }`} onClick={onClick}>Initialize</button>;
  };
  