export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 로고 */}
          <div>
            <span className="text-2xl font-bold text-[#4F46E5]">
              Frip<span className="text-[#7C3AED]">Biz</span>
            </span>
            <p className="text-sm mt-1 text-gray-500">
              기업 인사이트 프로그램 전문
            </p>
          </div>

          {/* 연락처 */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a href="tel:02-6218-0031" className="hover:text-[#4F46E5] transition-colors">
              📞 02-6218-0031
            </a>
            <a href="mailto:b2b@frientrip.com" className="hover:text-[#4F46E5] transition-colors">
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
