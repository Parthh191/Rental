'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#0a0a0a] font-sans antialiased">
        <AuthProvider>
          <NavBar />
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
