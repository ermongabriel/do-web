import Navbar from "@/components/marketing/navbar"
import Footer from "@/components/marketing/footer"
import ScrollToTop from "@/components/marketing/scroll-to-top"
import { Outlet } from "react-router-dom"

const MarketingLayout = () => {
  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navbar />
        <Outlet />
        <Footer />
      </main>
      <ScrollToTop />
    </>
  )
}

export default MarketingLayout