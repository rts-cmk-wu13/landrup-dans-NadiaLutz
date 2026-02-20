import Footer from "./components/Footer"

export default function AppLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}