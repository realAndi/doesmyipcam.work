import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { CameraProvider } from "@/components/camera/camera-context";
import { ThemeColorScript } from "@/components/theme-color-script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "IP Camera Viewer",
  description: "A mobile-friendly IP camera viewing application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IP Camera Viewer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeColorScript />
          <CameraProvider>
            <MobileLayout>{children}</MobileLayout>
          </CameraProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
