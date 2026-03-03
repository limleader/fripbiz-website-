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
