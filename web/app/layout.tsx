import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import { ScrollProvider } from "@/contexts/scrollContext";
import ReactLenis from "lenis/react";

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
          <ReactLenis
          root
          options={{
            lerp:0.1,
            duration: 1.2,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
          }}
          >
            <ScrollProvider>
              <div className="bg-back-light dark:bg-back-dark">
                <div className="flex justify-center sticky top-0 z-10"><NavBar /></div>
                {children}
              </div>
            </ScrollProvider>
          </ReactLenis>
        </ThemeProvider>
      </body>
    </html>
  );
}
