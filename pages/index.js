import Image from "next/image";
import { Inter } from "next/font/google";
import HomeScreen from "./Home";
import { useState } from "react";
import Cardpage from "./Components/cardpage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
  return (
    <div className="bg-slate-400 h-fit">
      <HomeScreen />
      <div className="p-10"><Cardpage /></div>
    </div>
  );
}
