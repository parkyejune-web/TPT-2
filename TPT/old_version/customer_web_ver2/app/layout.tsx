import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider, LayoutWrapper } from "../Shared/providers";
import { Header } from "../Widget/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TPT",
  description: "이젠 트레이딩도 PT 받는 시대. TPT",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
        {/* NICEPAY 결제 모듈 SDK */}
        <Script
          src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
