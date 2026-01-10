import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MemoryLink",
  description: "🤍✨A calm, private space to weave photos, videos, and voice notes into shared timelines with the people who matter most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.className}  antialiased `}
      >
        <ThemeProvider>
          <div className="dark:bg-[#050505]">
            <div className="flex justify-center sticky top-0"><NavBar /></div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
