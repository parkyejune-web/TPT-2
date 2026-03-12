import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider, LayoutWrapper } from "../Shared/providers";
import { Header } from "../Widget/Header";
import { Footer } from "../Widget/Footer";
import { NicePayScript } from "../Shared/components/NicePayScript";

const GA_TRACKING_ID = "G-C16LF6BHJ1";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TPT 트레이딩 - 모든 매매를 기록하세요",
  description:
    "매매일지 작성, 맞춤형 피드백, 체계적인 트레이딩 교육을 통해 스스로 성장하는 투자 습관을 완성하세요.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "TPT, 모든 매매를 기록하세요",
    description:
      "매매일지 작성, 맞춤형 피드백, 체계적인 트레이딩 교육을 통해 스스로 성장하는 투자 습관을 완성하세요.",
    images: [
      {
        url: "/images/kakao_link_thumbnail.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "TPT, 모든 매매를 기록하세요",
    description:
      "매매일지 작성, 맞춤형 피드백, 체계적인 트레이딩 교육을 통해 스스로 성장하는 투자 습관을 완성하세요.",
    images: "/images/kakao_link_thumbnail.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <meta name="naver-site-verification" content="d6af79037c5ac0edfa8ea0c54e9782fde79b2152" />

        {/* 구조화된 데이터 (JSON-LD) - 네이버/구글 SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.tradingpt.kr/#website",
                  "url": "https://www.tradingpt.kr",
                  "name": "TPT 트레이딩",
                  "description": "매매일지 작성, 맞춤형 피드백, 체계적인 트레이딩 교육을 통해 스스로 성장하는 투자 습관을 완성하세요.",
                  "inLanguage": "ko-KR"
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.tradingpt.kr/#organization",
                  "name": "TPT 트레이딩",
                  "url": "https://www.tradingpt.kr",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.tradingpt.kr/favicon.png"
                  }
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "홈",
                  "url": "https://www.tradingpt.kr/home"
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "강의",
                  "url": "https://www.tradingpt.kr/menu/class-list"
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "마이페이지",
                  "url": "https://www.tradingpt.kr/my"
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": "회원가입",
                  "url": "https://www.tradingpt.kr/signup"
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        {/* NICEPAY 결제 모듈 SDK */}
        <NicePayScript />
        <AuthProvider>
          <Header />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
