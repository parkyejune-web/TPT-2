import type { Metadata } from "next";
import "./globals.css";
import { MockDataProvider } from "./contexts/MockDataContext";

// 운영자 사이트는 네이버 등 검색 엔진에 등록하지 않습니다!
export const metadata: Metadata = {
  title: "TPT 운영",
  description: "트레이딩 피티 운영자 사이트입니다.",
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
    <html lang="en">
      <body>
        <MockDataProvider>
          {children}
        </MockDataProvider>
        <div id="portal-root" />
      </body>
    </html>
  );
}
