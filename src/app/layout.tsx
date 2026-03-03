import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "프립비즈 | 기업 인사이트 프로그램",
  description: "기업 임직원을 위한 맞춤형 교육·워크숍·트립 프로그램. 조직의 생산성과 인사이트를 높이세요.",
  keywords: "기업교육, 워크숍, 팀빌딩, 인사이트, 프립비즈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
