import { getProgramDetail } from "@/lib/notion";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 3600;

function renderBlock(block: BlockObjectResponse) {
  switch (block.type) {
    case "paragraph": {
      const text = block.paragraph.rich_text.map((t) => t.plain_text).join("");
      if (!text) return <br key={block.id} />;
      return <p key={block.id} className="text-gray-700 leading-relaxed mb-4">{text}</p>;
    }
    case "heading_1": {
      const text = block.heading_1.rich_text.map((t) => t.plain_text).join("");
      return <h1 key={block.id} className="text-2xl font-bold text-[#1A1A2E] mt-8 mb-4">{text}</h1>;
    }
    case "heading_2": {
      const text = block.heading_2.rich_text.map((t) => t.plain_text).join("");
      return <h2 key={block.id} className="text-xl font-bold text-[#1A1A2E] mt-6 mb-3">{text}</h2>;
    }
    case "heading_3": {
      const text = block.heading_3.rich_text.map((t) => t.plain_text).join("");
      return <h3 key={block.id} className="text-lg font-semibold text-[#1A1A2E] mt-5 mb-2">{text}</h3>;
    }
    case "bulleted_list_item": {
      const text = block.bulleted_list_item.rich_text.map((t) => t.plain_text).join("");
      return (
        <li key={block.id} className="text-gray-700 ml-4 mb-1 list-disc">
          {text}
        </li>
      );
    }
    case "numbered_list_item": {
      const text = block.numbered_list_item.rich_text.map((t) => t.plain_text).join("");
      return (
        <li key={block.id} className="text-gray-700 ml-4 mb-1 list-decimal">
          {text}
        </li>
      );
    }
    case "image": {
      const url =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.type === "external"
          ? block.image.external.url
          : null;
      if (!url) return null;
      return (
        <div key={block.id} className="relative w-full h-64 my-6 rounded-xl overflow-hidden">
          <Image src={url} alt="" fill className="object-cover" unoptimized />
        </div>
      );
    }
    case "divider":
      return <hr key={block.id} className="my-6 border-gray-200" />;
    case "quote": {
      const text = block.quote.rich_text.map((t) => t.plain_text).join("");
      return (
        <blockquote key={block.id} className="border-l-4 border-[#4F46E5] pl-4 italic text-gray-600 my-4">
          {text}
        </blockquote>
      );
    }
    case "callout": {
      const text = block.callout.rich_text.map((t) => t.plain_text).join("");
      const emoji = block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
      return (
        <div key={block.id} className="flex gap-3 bg-[#4F46E5]/10 rounded-xl p-4 my-4">
          <span>{emoji}</span>
          <p className="text-gray-700">{text}</p>
        </div>
      );
    }
    default:
      return null;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  "액티비티": "bg-orange-100 text-orange-700",
  "문화": "bg-purple-100 text-purple-700",
  "교육/강의": "bg-blue-100 text-blue-700",
  "여행": "bg-green-100 text-green-700",
  "팀빌딩": "bg-yellow-100 text-yellow-700",
  "심리": "bg-pink-100 text-pink-700",
  "웰니스": "bg-teal-100 text-teal-700",
};

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramDetail(id);

  if (!program) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 커버 이미지 */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-[#4F46E5]/30 to-[#7C3AED]/30">
        {program.coverUrl && (
          <Image
            src={program.coverUrl}
            alt={program.title}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* 뒤로가기 */}
        <Link
          href="/programs"
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          ← 목록으로
        </Link>

        {/* 제목 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            {program.category && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[program.category] ?? "bg-gray-100 text-gray-600"}`}>
                {program.category}
              </span>
            )}
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white leading-snug">
              {program.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 왼쪽: 상세 내용 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {program.blocks.length > 0 ? (
                <div>{program.blocks.map(renderBlock)}</div>
              ) : (
                <p className="text-gray-400 text-center py-8">상세 내용이 준비 중입니다.</p>
              )}
            </div>
          </div>

          {/* 오른쪽: 프로그램 정보 */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-4">프로그램 정보</h3>
              <dl className="space-y-3 text-sm">
                {program.capacity && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">수용인원</dt>
                    <dd className="font-medium text-[#1A1A2E]">{program.capacity}</dd>
                  </div>
                )}
                {program.duration && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">소요시간</dt>
                    <dd className="font-medium text-[#1A1A2E]">{program.duration}</dd>
                  </div>
                )}
                {program.pricePerPerson && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">1인 금액</dt>
                    <dd className="font-medium text-[#4F46E5]">{program.pricePerPerson}</dd>
                  </div>
                )}
                {program.regions.length > 0 && (
                  <div>
                    <dt className="text-gray-500 mb-1.5">출강 가능 지역</dt>
                    <dd className="flex flex-wrap gap-1">
                      {program.regions.map((r) => (
                        <span key={r} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {r}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {program.purpose.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-[#1A1A2E] mb-3">프로그램 목적</h3>
                <div className="flex flex-wrap gap-2">
                  {program.purpose.map((p) => (
                    <span key={p} className="text-sm bg-[#06D6A0]/10 text-[#06D6A0] px-3 py-1 rounded-full font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 문의 CTA */}
            <Link
              href="/#contact"
              className="block w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-center py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              이 프로그램 문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
