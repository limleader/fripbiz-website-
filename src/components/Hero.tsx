"use client";

import { motion } from "framer-motion";

const floatingShapes = [
  { size: 120, color: "#4F46E5", x: "10%", y: "20%", delay: 0 },
  { size: 80, color: "#7C3AED", x: "80%", y: "15%", delay: 0.5 },
  { size: 60, color: "#06D6A0", x: "70%", y: "70%", delay: 1 },
  { size: 100, color: "#4F46E5", x: "15%", y: "75%", delay: 0.3 },
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
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#4F46E5]/20 rounded-full px-4 py-2 mb-6 shadow-sm"
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
          <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
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
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-[#4F46E5]/30"
          >
            프로그램 둘러보기
          </a>
          <a
            href="#contact"
            className="bg-white hover:bg-gray-50 text-[#1A1A2E] border-2 border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:border-[#4F46E5]"
          >
            견적 문의하기
          </a>
        </motion.div>
      </div>

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
    </section>
  );
}
