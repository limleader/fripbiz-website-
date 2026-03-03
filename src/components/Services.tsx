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
