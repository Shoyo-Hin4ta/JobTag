import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JobTag - Track Jobs While Sleeping | AI Job Application Tracker",
  description: "AI-powered job application tracking that organizes your inbox automatically. Track job applications from Gmail and Outlook with auto-labeling. Free to start!",
  keywords: ["job tracking", "job search", "application tracker", "career", "AI", "email parsing", "gmail job tracker", "outlook job organizer", "job application manager"],
  authors: [{ name: "JobTag" }],
  openGraph: {
    title: "JobTag - Track Jobs While Sleeping",
    description: "Turn your messy inbox into a career command center. AI-powered job tracking with auto-labeling for Gmail & Outlook.",
    type: "website",
    url: "https://jobtag.app",
    siteName: "JobTag",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JobTag - AI Job Application Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobTag - Track Jobs While Sleeping",
    description: "Turn your messy inbox into a career command center. AI-powered job tracking with auto-labeling.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}