import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CameraProvider } from "@/components/camera/camera-context";
import { ThemeColorScript } from "@/components/theme-color-script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Does My IP Cam Work?",
  description: "A simple, secure way to view your Sharx SCNC IP cameras from any device",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IP Cam Viewer",
  },
  icons: {
    apple: [
      { url: "/pwa/appicon.png", sizes: "512x512", type: "image/png" },
    ],
    icon: "/pwa/appicon.png",
    shortcut: "/pwa/appicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/pwa/appicon.png" />
        <link rel="apple-touch-icon-precomposed" href="/pwa/appicon.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/pwa/appicon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CameraProvider>
            <ThemeColorScript />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,hsl(var(--accent)))_0%,transparent_70%)] opacity-20 pointer-events-none" />
            <main className="min-h-screen pb-24 md:pb-8 md:pt-20 overflow-x-hidden relative">
              {children}
            </main>
          </CameraProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
