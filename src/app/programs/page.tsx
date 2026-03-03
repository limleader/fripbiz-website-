"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Program } from "@/lib/notion";

const PROGRAM_TYPES = [
  { label: "전체", value: "" },
  { label: "인사이트 렉쳐", value: "인사이트 렉쳐" },
  { label: "인사이트 워크숍", value: "인사이트 워크숍" },
  { label: "인사이트 트립", value: "인사이트 트립" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "액티비티": "bg-orange-100 text-orange-700",
  "문화": "bg-purple-100 text-purple-700",
  "교육/강의": "bg-blue-100 text-blue-700",
  "여행": "bg-green-100 text-green-700",
  "팀빌딩": "bg-yellow-100 text-yellow-700",
  "심리": "bg-pink-100 text-pink-700",
  "웰니스": "bg-teal-100 text-teal-700",
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/programs?type=${encodeURIComponent(selectedType)}`)
      .then((r) => r.json())
      .then((data) => {
        setPrograms(data.programs ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedType]);

  const categories = Array.from(
    new Set(programs.map((p) => p.category).filter(Boolean))
  );

  const filtered =
    selectedCategory
      ? programs.filter((p) => p.category === selectedCategory)
      : programs;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d1b69] pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            프로그램 둘러보기
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/70 text-lg"
          >
            우리 조직에 꼭 맞는 프로그램을 찾아보세요
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 프로그램 유형 필터 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {PROGRAM_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setSelectedType(type.value);
                setSelectedCategory("");
              }}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                selectedType === type.value
                  ? "bg-[#FF6B35] text-white shadow-lg scale-105"
                  : "bg-white text-[#1A1A2E] border border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                selectedCategory === ""
                  ? "bg-[#7C3AED] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#7C3AED] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* 프로그램 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">해당 프로그램이 없습니다.</p>
          </div>
        ) : (
          <motion.div
            key={selectedType + selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="h-full"
              >
                <Link href={`/programs/${program.id}`} className="h-full block">
                  <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    {/* 커버 이미지 */}
                    <div className="relative h-48 bg-gradient-to-br from-[#FF6B35]/20 to-[#7C3AED]/20">
                      {program.coverUrl ? (
                        <Image
                          src={program.coverUrl}
                          alt={program.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">🎯</span>
                        </div>
                      )}
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* 카테고리 태그 */}
                      {program.category && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[program.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {program.category}
                        </span>
                      )}

                      {/* 제목 */}
                      <h3 className="mt-2 font-bold text-[#1A1A2E] text-base leading-snug line-clamp-2 group-hover:text-[#FF6B35] transition-colors">
                        {program.title}
                      </h3>

                      {/* 메타 정보 */}
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                        {program.capacity && (
                          <span className="flex items-center gap-1">
                            <span>👥</span> {program.capacity}
                          </span>
                        )}
                        {program.duration && (
                          <span className="flex items-center gap-1">
                            <span>⏱</span> {program.duration}
                          </span>
                        )}
                        {program.pricePerPerson && (
                          <span className="flex items-center gap-1">
                            <span>💰</span> {program.pricePerPerson}
                          </span>
                        )}
                      </div>

                      {/* 목적 태그 */}
                      {program.purpose.length > 0 && (
                        <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                          {program.purpose.slice(0, 3).map((p) => (
                            <span key={p} className="text-xs bg-[#06D6A0]/10 text-[#06D6A0] px-2 py-0.5 rounded-full font-medium">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
