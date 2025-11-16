import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Poppins } from 'next/font/google';
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Trip Finder",
  description: "Find Exciting trips near you.",
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Add the weights you need
  variable: '--font-poppins',    // Optional: for using as a CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={poppins.variable}>
      <body className="bg-[#f2f2f2]">
        <ToastContainer position="top-right"/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
