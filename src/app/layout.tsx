import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

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

export const metadata: Metadata = {
  title: "SpaceCrammers",
  description: "This site allows you to track Landsat 8-9 whereabouts",
  openGraph: {
    title: "SpaceCrammers",
    description: "This site allows you to track Landsat 8-9 whereabouts",
    url: "https://nextjs.org",
    siteName: "SpaceCrammers",
    images: [
      {
        url: "/opengraph.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased min-h-screen`}
      >
        <Toaster richColors={true} closeButton={true} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="mt-8 sm:px-8">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
