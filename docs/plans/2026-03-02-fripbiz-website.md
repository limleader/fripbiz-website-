# Fripbiz Website Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 프립비즈(Frip Biz) B2B 기업 서비스 웹사이트를 생동감 있는 현대적 UI로 재구성하고 Vercel에 배포한다.

**Architecture:** Next.js 15 App Router를 사용한 단일 페이지 구성. 각 섹션(Hero, Services, Process, ContactForm)을 독립 컴포넌트로 분리하고, 문의 폼은 Next.js API Route + Resend로 서버사이드 이메일 발송 처리.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Resend API, Vercel

---

## 사전 준비

- Node.js 18+ 설치 확인: `node -v`
- npm 설치 확인: `npm -v`
- 작업 디렉토리: `/Users/limsooyul/fripbiz-website`

---

### Task 1: Next.js 프로젝트 초기화

**Files:**
- Create: `/Users/limsooyul/fripbiz-website/` (프로젝트 루트)

**Step 1: Next.js 프로젝트 생성**

```bash
cd /Users/limsooyul
npx create-next-app@latest fripbiz-website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-turbopack \
  --import-alias "@/*"
```

프롬프트가 나오면 모두 기본값(Enter)으로 진행.

**Step 2: 프로젝트 디렉토리로 이동 및 추가 패키지 설치**

```bash
cd /Users/limsooyul/fripbiz-website
npm install framer-motion resend
npm install -D @types/node
```

**Step 3: 개발 서버 실행 확인**

```bash
npm run dev
```

Expected: `http://localhost:3000` 에서 Next.js 기본 페이지 표시

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with TypeScript, Tailwind, Framer Motion"
```

---

### Task 2: 전역 스타일 및 폰트 설정

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: globals.css 설정**

`src/app/globals.css`를 다음 내용으로 교체:

```css
@import "tailwindcss";

@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

:root {
  --color-primary: #FF6B35;
  --color-secondary: #7C3AED;
  --color-accent: #06D6A0;
  --color-bg: #FAFAFA;
  --color-text: #1A1A2E;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

**Step 2: layout.tsx 업데이트**

`src/app/layout.tsx`를 다음 내용으로 교체:

```tsx
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
```

**Step 3: 개발 서버에서 폰트 로드 확인**

```bash
npm run dev
```

브라우저 DevTools → Network 탭에서 Pretendard 폰트 로드 확인

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure global styles, fonts, and color tokens"
```

---

### Task 3: Header 컴포넌트

**Files:**
- Create: `src/components/Header.tsx`

**Step 1: Header 컴포넌트 작성**

`src/components/Header.tsx` 파일 생성:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "서비스 소개", href: "#services" },
  { label: "프로그램", href: "#programs" },
  { label: "프로세스", href: "#process" },
  { label: "문의", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 로고 */}
        <a href="#" className="text-2xl font-bold text-[#FF6B35]">
          Frip<span className="text-[#7C3AED]">Biz</span>
        </a>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#1A1A2E] hover:text-[#FF6B35] font-medium transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA 버튼 */}
        <a
          href="#contact"
          className="bg-[#FF6B35] hover:bg-[#e55a24] text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          견적 문의하기
        </a>
      </div>
    </motion.header>
  );
}
```

**Step 2: page.tsx에 Header 추가**

`src/app/page.tsx`를 다음으로 교체:

```tsx
import Header from "@/components/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl">여기에 히어로 섹션이 들어갑니다</p>
      </div>
    </main>
  );
}
```

**Step 3: 브라우저에서 Header 확인**

`http://localhost:3000` 에서:
- 헤더가 상단 고정되어 있는지 확인
- 스크롤 시 배경 흰색으로 전환되는지 확인
- "견적 문의하기" 버튼 호버 효과 확인

**Step 4: Commit**

```bash
git add src/components/Header.tsx src/app/page.tsx
git commit -m "feat: add sticky header with scroll effect and navigation"
```

---

### Task 4: Hero 섹션

**Files:**
- Create: `src/components/Hero.tsx`

**Step 1: Hero 컴포넌트 작성**

`src/components/Hero.tsx` 파일 생성:

```tsx
"use client";

import { motion } from "framer-motion";

const floatingShapes = [
  { size: 120, color: "#FF6B35", x: "10%", y: "20%", delay: 0 },
  { size: 80, color: "#7C3AED", x: "80%", y: "15%", delay: 0.5 },
  { size: 60, color: "#06D6A0", x: "70%", y: "70%", delay: 1 },
  { size: 100, color: "#FF6B35", x: "15%", y: "75%", delay: 0.3 },
  { size: 40, color: "#7C3AED", x: "50%", y: "85%", delay: 0.8 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#F0F4FF] to-[#FFF0EB]">
      {/* 플로팅 배경 도형들 */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-15 blur-xl"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        {/* 배지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#FF6B35]/20 rounded-full px-4 py-2 mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
          <span className="text-sm font-medium text-[#1A1A2E]">기업 맞춤형 인사이트 프로그램</span>
        </motion.div>

        {/* 메인 헤딩 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-[#1A1A2E] leading-tight mb-6"
        >
          조직에도{" "}
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] bg-clip-text text-transparent">
            인사이트
          </span>
          가<br />필요합니다
        </motion.h1>

        {/* 서브 카피 */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          효과적인 인사이트는 조직의 문제를 해결하고,
          <br className="hidden md:block" />
          변화하는 환경에 유연하게 대응하며, 새로운 기회를 포착해냅니다.
        </motion.p>

        {/* CTA 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#services"
            className="bg-[#FF6B35] hover:bg-[#e55a24] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-[#FF6B35]/30"
          >
            프로그램 둘러보기
          </a>
          <a
            href="#contact"
            className="bg-white hover:bg-gray-50 text-[#1A1A2E] border-2 border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:border-[#FF6B35]"
          >
            견적 문의하기
          </a>
        </motion.div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: page.tsx에 Hero 추가**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
    </main>
  );
}
```

**Step 3: 브라우저에서 Hero 확인**

- 플로팅 도형 애니메이션이 움직이는지 확인
- 그라디언트 텍스트 표시되는지 확인
- CTA 버튼 두 개 모두 보이는지 확인
- 스크롤 인디케이터 바운스 애니메이션 확인

**Step 4: Commit**

```bash
git add src/components/Hero.tsx src/app/page.tsx
git commit -m "feat: add hero section with animated background and CTAs"
```

---

### Task 5: Services 섹션

**Files:**
- Create: `src/components/Services.tsx`

**Step 1: Services 컴포넌트 작성**

`src/components/Services.tsx` 파일 생성:

```tsx
"use client";

import { motion } from "framer-motion";

const services = [
  {
    id: "lecture",
    icon: "🎓",
    title: "인사이트 렉처",
    subtitle: "Insight Lecture",
    description: "업무 스킬 강화 및 효율성 개선을 위한 맞춤형 교육·강의 프로그램입니다. 직무 역량 개발과 전문성 향상에 중점을 둡니다.",
    tags: ["직무 역량", "전문성 강화", "교육"],
    color: "#FF6B35",
    bgColor: "#FFF4F0",
  },
  {
    id: "workshop",
    icon: "🤝",
    title: "인사이트 워크숍",
    subtitle: "Insight Workshop",
    description: "5가지 기업 솔루션을 결합한 팀 단위 역량 강화 프로그램입니다. 리프레시, 트렌드 팔로업, 스트레스 관리, 갈등 관리, 역량 강화.",
    tags: ["팀빌딩", "갈등 관리", "역량 강화"],
    color: "#7C3AED",
    bgColor: "#F5F0FF",
  },
  {
    id: "trip",
    icon: "✈️",
    title: "인사이트 트립",
    subtitle: "Insight Trip",
    description: "트립 프레임을 활용해 프로그램을 조합하는 맞춤형 워크숍 여행입니다. 경험 기반 학습으로 팀 전체의 인사이트를 극대화합니다.",
    tags: ["워크숍 여행", "경험 학습", "맞춤 설계"],
    color: "#06D6A0",
    bgColor: "#F0FDF9",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Our Programs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            3가지 인사이트 프로그램
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            기업의 상황과 목표에 맞게 조합하여 최적의 솔루션을 제공합니다
          </p>
        </motion.div>

        {/* 서비스 카드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ backgroundColor: service.bgColor }}
            >
              {/* 아이콘 */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm"
                style={{ backgroundColor: service.color + "20" }}
              >
                {service.icon}
              </div>

              {/* 제목 */}
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-1">
                {service.title}
              </h3>
              <p
                className="text-sm font-medium mb-4"
                style={{ color: service.color }}
              >
                {service.subtitle}
              </p>

              {/* 설명 */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: service.color + "15",
                      color: service.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: page.tsx에 Services 추가**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
    </main>
  );
}
```

**Step 3: 브라우저에서 Services 확인**

- 3개 카드가 그리드로 표시되는지 확인
- 스크롤 시 카드 순차 페이드인 확인
- 카드 호버 시 위로 올라오는 효과 확인

**Step 4: Commit**

```bash
git add src/components/Services.tsx src/app/page.tsx
git commit -m "feat: add services section with animated cards"
```

---

### Task 6: Process 섹션

**Files:**
- Create: `src/components/Process.tsx`

**Step 1: Process 컴포넌트 작성**

`src/components/Process.tsx` 파일 생성:

```tsx
"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "문의 접수",
    description: "전화 또는 온라인 폼으로 간단한 문의를 남겨주세요.",
    icon: "📋",
    color: "#FF6B35",
  },
  {
    number: "02",
    title: "솔루션 설계",
    description: "1-2회 미팅을 통해 귀사의 상황과 목표에 맞는 맞춤형 솔루션을 설계합니다.",
    icon: "🎯",
    color: "#7C3AED",
  },
  {
    number: "03",
    title: "맞춤형 제안",
    description: "설계된 솔루션에 대한 상세한 제안서와 견적을 제공합니다.",
    icon: "📊",
    color: "#06D6A0",
  },
  {
    number: "04",
    title: "프로그램 진행",
    description: "프로그램을 진행하고 참가자 만족도 조사를 통해 효과를 측정합니다.",
    icon: "🚀",
    color: "#FF6B35",
  },
  {
    number: "05",
    title: "최상의 기업복지",
    description: "임직원 만족도와 조직 성과가 함께 높아지는 최상의 결과를 달성합니다.",
    icon: "🏆",
    color: "#7C3AED",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-gradient-to-br from-[#1A1A2E] to-[#2D1B6E]">
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            간단한 5단계 프로세스
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            문의부터 최상의 결과까지, 모든 단계를 함께합니다
          </p>
        </motion.div>

        {/* 타임라인 */}
        <div className="relative">
          {/* 연결선 */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#FF6B35] via-[#7C3AED] to-[#06D6A0] opacity-30" />

          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* 아이콘 원 */}
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 shadow-lg"
                  style={{
                    backgroundColor: step.color + "20",
                    border: `2px solid ${step.color}40`,
                  }}
                >
                  <span>{step.icon}</span>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: page.tsx에 Process 추가**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Process />
    </main>
  );
}
```

**Step 3: 브라우저에서 Process 확인**

- 다크 배경에 5단계 타임라인 표시 확인
- 스크롤 시 순차 등장 애니메이션 확인
- 모바일에서 세로 정렬 확인

**Step 4: Commit**

```bash
git add src/components/Process.tsx src/app/page.tsx
git commit -m "feat: add process section with 5-step timeline"
```

---

### Task 7: 문의 폼 API Route

**Files:**
- Create: `src/app/api/contact/route.ts`

> **주의:** Resend API 키가 필요합니다. https://resend.com 에서 무료 가입 후 API 키 발급.

**Step 1: .env.local 파일 생성**

프로젝트 루트에 `.env.local` 파일 생성:

```
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=b2b@frientrip.com
```

> **실제 값:** Resend 대시보드에서 발급한 API 키 입력. `CONTACT_EMAIL`은 문의 이메일이 수신될 주소.

**Step 2: API Route 작성**

`src/app/api/contact/route.ts` 파일 생성:

```ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
}

function validateForm(data: ContactFormData): string | null {
  if (!data.company?.trim()) return "회사명을 입력해주세요.";
  if (!data.name?.trim()) return "담당자 이름을 입력해주세요.";
  if (!data.email?.trim()) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "올바른 이메일 형식이 아닙니다.";
  if (!data.phone?.trim()) return "전화번호를 입력해주세요.";
  if (!data.message?.trim()) return "문의 내용을 입력해주세요.";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    const validationError = validateForm(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const servicesText = body.services.length > 0
      ? body.services.join(", ")
      : "미선택";

    await resend.emails.send({
      from: "프립비즈 문의 <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "b2b@frientrip.com"],
      subject: `[프립비즈 문의] ${body.company} - ${body.name}`,
      html: `
        <h2>새로운 견적 문의가 도착했습니다</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">회사명</td><td style="padding:8px;border:1px solid #ddd">${body.company}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">담당자</td><td style="padding:8px;border:1px solid #ddd">${body.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">이메일</td><td style="padding:8px;border:1px solid #ddd">${body.email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">전화번호</td><td style="padding:8px;border:1px solid #ddd">${body.phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">관심 서비스</td><td style="padding:8px;border:1px solid #ddd">${servicesText}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold">문의 내용</td><td style="padding:8px;border:1px solid #ddd">${body.message.replace(/\n/g, "<br>")}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
```

**Step 3: API 동작 테스트**

터미널에서:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"company":"테스트컴퍼니","name":"홍길동","email":"test@test.com","phone":"010-1234-5678","services":["워크숍"],"message":"테스트 문의입니다."}'
```

Expected: `{"success":true}` 응답 및 이메일 수신 확인

**Step 4: Commit**

```bash
git add src/app/api/contact/route.ts
git commit -m "feat: add contact form API route with Resend email integration"
```

> `.env.local`은 `.gitignore`에 자동으로 포함되어 있으므로 커밋되지 않습니다.

---

### Task 8: ContactForm 컴포넌트

**Files:**
- Create: `src/components/ContactForm.tsx`

**Step 1: ContactForm 컴포넌트 작성**

`src/components/ContactForm.tsx` 파일 생성:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const serviceOptions = [
  { id: "lecture", label: "인사이트 렉처" },
  { id: "workshop", label: "인사이트 워크숍" },
  { id: "trip", label: "인사이트 트립" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    services: [] as string[],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "오류가 발생했습니다.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ company: "", name: "", email: "", phone: "", services: [], message: "" });
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-200 bg-white text-[#1A1A2E]";

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-[#FAFAFA] to-[#F5F0FF]">
      <div className="max-w-3xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#7C3AED] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            견적 문의하기
          </h2>
          <p className="text-gray-500 text-lg">
            양식을 작성해 주시면 1-2 영업일 내에 연락드립니다
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <span>📞 02-6218-0031</span>
            <span>✉️ b2b@frientrip.com</span>
          </div>
        </motion.div>

        {/* 폼 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 md:p-10"
        >
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">문의가 접수되었습니다!</h3>
              <p className="text-gray-500">1-2 영업일 내에 담당자가 연락드리겠습니다.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-[#FF6B35] font-medium hover:underline"
              >
                새 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 회사명 + 담당자 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    회사명 <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="(주)프립비즈"
                    value={formData.company}
                    onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    담당자 이름 <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* 이메일 + 전화번호 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일 <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="example@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    전화번호 <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="02-0000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* 관심 서비스 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관심 서비스 (복수 선택 가능)
                </label>
                <div className="flex flex-wrap gap-3">
                  {serviceOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleServiceToggle(option.label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                        formData.services.includes(option.label)
                          ? "bg-[#FF6B35] border-[#FF6B35] text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#FF6B35]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  문의 내용 <span className="text-[#FF6B35]">*</span>
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={5}
                  placeholder="문의하실 내용을 자유롭게 적어주세요. (예상 인원, 희망 일정, 목적 등)"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  required
                />
              </div>

              {/* 에러 메시지 */}
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {errorMessage}
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#7C3AED] text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-orange-200"
              >
                {status === "loading" ? "전송 중..." : "문의 보내기 →"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: page.tsx에 ContactForm 추가**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Process />
      <ContactForm />
    </main>
  );
}
```

**Step 3: 브라우저에서 ContactForm 확인**

- 폼 필드 모두 표시되는지 확인
- 서비스 토글 버튼 동작 확인
- 빈 폼 제출 시 required 유효성 검사 확인
- (Resend API 키 설정 후) 실제 이메일 발송 테스트

**Step 4: Commit**

```bash
git add src/components/ContactForm.tsx src/app/page.tsx
git commit -m "feat: add contact form with validation and email submission"
```

---

### Task 9: Footer 컴포넌트

**Files:**
- Create: `src/components/Footer.tsx`

**Step 1: Footer 컴포넌트 작성**

`src/components/Footer.tsx` 파일 생성:

```tsx
export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 로고 */}
          <div>
            <span className="text-2xl font-bold text-[#FF6B35]">
              Frip<span className="text-[#7C3AED]">Biz</span>
            </span>
            <p className="text-sm mt-1 text-gray-500">
              기업 인사이트 프로그램 전문
            </p>
          </div>

          {/* 연락처 */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a href="tel:02-6218-0031" className="hover:text-[#FF6B35] transition-colors">
              📞 02-6218-0031
            </a>
            <a href="mailto:b2b@frientrip.com" className="hover:text-[#FF6B35] transition-colors">
              ✉️ b2b@frientrip.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-600">
          © 2024 FripBiz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: page.tsx에 Footer 추가**

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Process />
      <ContactForm />
      <Footer />
    </main>
  );
}
```

**Step 3: 전체 페이지 최종 확인**

`http://localhost:3000` 에서 전체 스크롤 테스트:
- 헤더 → 히어로 → 서비스 → 프로세스 → 문의폼 → 푸터 순서 확인
- 네비게이션 앵커 링크 동작 확인 (`#services`, `#process`, `#contact`)
- 모바일 뷰 (`375px`) 확인

**Step 4: Commit**

```bash
git add src/components/Footer.tsx src/app/page.tsx
git commit -m "feat: add footer and complete full page layout"
```

---

### Task 10: Vercel 배포

**Step 1: GitHub 레포지토리 생성 및 Push**

```bash
# GitHub에서 새 레포 생성 후 (fripbiz-website)
git remote add origin https://github.com/YOUR_USERNAME/fripbiz-website.git
git branch -M main
git push -u origin main
```

**Step 2: Vercel 연결**

1. https://vercel.com 접속 후 로그인 (GitHub 계정으로 가능)
2. "New Project" 클릭
3. `fripbiz-website` 레포 선택 → Import
4. Framework Preset: **Next.js** (자동 감지됨)
5. "Environment Variables" 섹션에 추가:
   - `RESEND_API_KEY` = 발급받은 Resend API 키
   - `CONTACT_EMAIL` = 이메일 수신 주소
6. "Deploy" 클릭

**Step 3: 배포 확인**

- Vercel이 제공하는 URL (예: `fripbiz-website.vercel.app`)에서 동작 확인
- 문의 폼 실제 제출 테스트
- 이메일 수신 확인

**Step 4: (선택) 커스텀 도메인 연결**

Vercel Dashboard → Project → Settings → Domains에서 도메인 추가 가능

---

## 완성 체크리스트

- [ ] Hero 섹션 — 플로팅 애니메이션, 그라디언트 텍스트, CTA 버튼
- [ ] Services 섹션 — 3개 카드, 호버 효과, 스크롤 애니메이션
- [ ] Process 섹션 — 5단계 타임라인, 다크 배경
- [ ] ContactForm — 유효성 검사, 이메일 발송, 성공/실패 피드백
- [ ] Footer — 연락처, 저작권
- [ ] 네비게이션 앵커 링크 동작
- [ ] 모바일 반응형 레이아웃
- [ ] Vercel 배포 완료
- [ ] 실제 이메일 수신 확인
