import "./globals.scss"

export const metadata = {
  title: "Landrup Dans",
  description: "Mobil web-app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}