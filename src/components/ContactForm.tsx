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

  const handleServiceToggle = (serviceLabel: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceLabel)
        ? prev.services.filter((s) => s !== serviceLabel)
        : [...prev.services, serviceLabel],
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200 bg-white text-[#1A1A2E]";

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
                className="mt-6 text-[#4F46E5] font-medium hover:underline"
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
                    회사명 <span className="text-[#4F46E5]">*</span>
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
                    담당자 이름 <span className="text-[#4F46E5]">*</span>
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
                    이메일 <span className="text-[#4F46E5]">*</span>
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
                    전화번호 <span className="text-[#4F46E5]">*</span>
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
                          ? "bg-[#4F46E5] border-[#4F46E5] text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#4F46E5]"
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
                  문의 내용 <span className="text-[#4F46E5]">*</span>
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
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-orange-200"
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
