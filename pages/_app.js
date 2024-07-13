import "@/styles/globals.css";
import Navbar from "./Components/Navbar";
import WalletContextProvider from "./Components/WalletContextProvider";
export default function App({ Component, pageProps }) {
  return (
    <>
      <WalletContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </WalletContextProvider>
    </>
  )
}
