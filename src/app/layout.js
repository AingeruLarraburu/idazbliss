// skipcq: JS-0128
import Navbar from "../components/NavBar/Navbar";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";
// skipcq: JS-0128
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "IdazBliss",
  description: "El traductor de Bliss para todos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/*<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>*/}
      <body className="flex flex-col h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
