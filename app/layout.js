import { League_Spartan } from "next/font/google";
import "./globals.css";
import ReactLenis from "lenis/react";

const font = League_Spartan({
  subsets: ["latin"],
})

export const metadata = {
  title: "Refyn",
  description: "See how refining a plain-English prompt changes large language model outputs — using the same model, the same settings, and nothing else",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReactLenis root>
        <body
          className={`${font.className} antialiased`}
        >
          {children}
        </body>
      </ReactLenis>
    </html>
  );
}
