import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import Navbar from "@/components/Layout/Navbar";
export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
