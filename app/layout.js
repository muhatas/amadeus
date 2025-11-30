import { Geist, Geist_Mono } from "next/font/google";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Context
import { BookingProvider } from "@/context/bookingContext";

// Styles
import "../src/styles/styles.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amadeus",
  description: "Search Flights",
};

export default function RootLayout({ children }) {
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
