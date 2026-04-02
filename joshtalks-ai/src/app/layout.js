import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


export const metadata = {
  title: "Estrax — Data for Next-Gen AI",
  description: "A premium data collection platform for regional AI model training.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ParticleBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>

    </html>
  );
}
