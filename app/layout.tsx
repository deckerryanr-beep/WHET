import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WHET — What's Hot, Expertly Tailored",
  description:
    "Your personal taste advisor for wine, whiskey, athletic wear, and going-out style. Log your experiences and let WHET steer you toward your next great find.",
  keywords: ["wine advisor", "whiskey recommendations", "athletic wear", "personal stylist", "taste profile"],
  openGraph: {
    title: "WHET",
    description: "What's Hot, Expertly Tailored",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
