import Image from "next/image";
import { Inter } from "next/font/google";
import HomeScreen from "./Home";
import { useState } from "react";
import Cardpage from "./Components/cardpage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
  return (
    <>
      <HomeScreen />
      <Cardpage />
    </>
  );
}
