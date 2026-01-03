import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Context
import { BookingProvider } from "@/context/bookingContext";

// Styles
import "@/styles/styles.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amadeus",
  description: "Search Flights",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <BookingProvider>{children}</BookingProvider>
        <Footer />
      </body>
    </html>
  );
}
