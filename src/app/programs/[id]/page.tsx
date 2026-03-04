import { getProgramDetail } from "@/lib/notion";
import type { RichBlock } from "@/lib/notion";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

// YouTube URL → embed ID 추출
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&\s]+)/);
  return match ? match[1] : null;
}

// Rich text → 텍스트/HTML 변환
function richTextToString(richText: { plain_text: string }[]): string {
  return richText.map((t) => t.plain_text).join("");
}

function renderRichText(richText: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[]) {
  return richText.map((t, i) => {
    let el: React.ReactNode = t.plain_text;
    if (t.annotations?.code) el = <code key={i} className="bg-gray-100 text-[#4F46E5] px-1 rounded text-sm">{el}</code>;
    else if (t.annotations?.bold) el = <strong key={i}>{el}</strong>;
    else if (t.annotations?.italic) el = <em key={i}>{el}</em>;
    else el = <span key={i}>{el}</span>;
    if (t.href) el = <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline">{t.plain_text}</a>;
    return el;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any): React.ReactNode {
  switch (block.type) {
    case "paragraph": {
      const rt = (block.paragraph as { rich_text: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[] }).rich_text;
      if (!rt.length || rt.every(t => !t.plain_text)) return <div key={block.id} className="h-3" />;
      return <p key={block.id} className="text-gray-700 leading-relaxed mb-3">{renderRichText(rt)}</p>;
    }
    case "heading_1": {
      const text = richTextToString((block.heading_1 as { rich_text: { plain_text: string }[] }).rich_text);
      return <h2 key={block.id} className="text-2xl font-bold text-[#1A1A2E] mt-10 mb-4 pb-2 border-b border-gray-100">{text}</h2>;
    }
    case "heading_2": {
      const text = richTextToString((block.heading_2 as { rich_text: { plain_text: string }[] }).rich_text);
      return <h3 key={block.id} className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">{text}</h3>;
    }
    case "heading_3": {
      const text = richTextToString((block.heading_3 as { rich_text: { plain_text: string }[] }).rich_text);
      return <h4 key={block.id} className="text-lg font-semibold text-[#1A1A2E] mt-6 mb-2">{text}</h4>;
    }
    case "bulleted_list_item": {
      const rt = (block.bulleted_list_item as { rich_text: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[] }).rich_text;
      return <li key={block.id} className="text-gray-700 ml-5 mb-1.5 list-disc">{renderRichText(rt)}</li>;
    }
    case "numbered_list_item": {
      const rt = (block.numbered_list_item as { rich_text: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[] }).rich_text;
      return <li key={block.id} className="text-gray-700 ml-5 mb-1.5 list-decimal">{renderRichText(rt)}</li>;
    }
    case "quote": {
      const rt = (block.quote as { rich_text: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[] }).rich_text;
      return (
        <blockquote key={block.id} className="border-l-4 border-[#4F46E5] pl-4 text-gray-600 my-3 leading-relaxed">
          {renderRichText(rt)}
        </blockquote>
      );
    }
    case "callout": {
      const callout = block.callout as { rich_text: { plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean }; href?: string | null }[]; icon?: { type: string; emoji?: string } };
      const rt = callout.rich_text;
      const emoji = callout.icon?.type === "emoji" ? callout.icon.emoji : "💡";
      // 3열 callout (준비사항) - children이 있으면 내부 블록 렌더링
      if (block.children?.length) {
        return (
          <div key={block.id} className="bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl p-5 my-4">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg">{emoji}</span>
              <p className="font-semibold text-[#1A1A2E]">{renderRichText(rt)}</p>
            </div>
            <div>{block.children.map(renderBlock)}</div>
          </div>
        );
      }
      return (
        <div key={block.id} className="flex gap-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-xl p-5 my-4">
          <span className="text-lg mt-0.5">{emoji}</span>
          <p className="text-gray-700 leading-relaxed">{renderRichText(rt)}</p>
        </div>
      );
    }
    case "video": {
      const video = block.video as { type: string; external?: { url: string } };
      const url = video.type === "external" ? video.external?.url ?? "" : "";
      const ytId = getYouTubeId(url);
      if (!ytId) return null;
      return (
        <div key={block.id} className="my-6 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case "image": {
      const image = block.image as { type: string; file?: { url: string }; external?: { url: string } };
      const url = image.type === "file" ? image.file?.url : image.external?.url;
      if (!url) return null;
      return (
        <div key={block.id} className="relative w-full rounded-xl overflow-hidden my-4" style={{ aspectRatio: "4/3" }}>
          <Image src={url} alt="" fill className="object-cover" unoptimized />
        </div>
      );
    }
    case "column_list": {
      const cols = block.children ?? [];
      return (
        <div key={block.id} className={`grid gap-4 my-4 ${cols.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {cols.map((col: any) => (
            <div key={col.id}>
              {(col.children ?? []).map(renderBlock)}
            </div>
          ))}
        </div>
      );
    }
    case "divider":
      return <hr key={block.id} className="my-8 border-gray-200" />;
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

function MetaRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 w-32 shrink-0 text-gray-500 text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramDetail(id);
  if (!program) notFound();

  const capacityLines = program.capacity
    ? program.capacity.split(/(?=\[출강\])/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 커버 이미지 */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20">
        {program.coverUrl && (
          <Image src={program.coverUrl} alt={program.title} fill className="object-cover" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          href="/programs"
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          ← 목록으로
        </Link>
      </div>

      {/* 상품 헤더 */}
      <div className="bg-[#1A1A2E] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 카테고리 태그 */}
          {program.category && (
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[program.category] ?? "bg-gray-100 text-gray-600"}`}>
              {program.category}
            </span>
          )}
          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-8">
            {program.title}
          </h1>

          {/* 메타 정보 테이블 */}
          <div className="bg-white/5 rounded-2xl px-6 divide-y divide-white/10">
            {program.subCategory.length > 0 && (
              <MetaRow icon="≔" label="중분류">
                <div className="flex flex-wrap gap-1.5">
                  {program.subCategory.map((s) => (
                    <span key={s} className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </MetaRow>
            )}
            {program.purpose.length > 0 && (
              <MetaRow icon="≔" label="목적">
                <div className="flex flex-wrap gap-1.5">
                  {program.purpose.map((p) => (
                    <span key={p} className="bg-[#06D6A0]/20 text-[#06D6A0] text-xs font-semibold px-2.5 py-1 rounded-full">{p}</span>
                  ))}
                </div>
              </MetaRow>
            )}
            {program.regions.length > 0 && (
              <MetaRow icon="≔" label="출강가능지역">
                <div className="flex flex-wrap gap-1.5">
                  {program.regions.map((r) => (
                    <span key={r} className="bg-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{r}</span>
                  ))}
                </div>
              </MetaRow>
            )}
            {program.keywords && (
              <MetaRow icon="✳︎" label="키워드">
                <span className="text-white/70">{program.keywords}</span>
              </MetaRow>
            )}
            {program.pricePerPerson && (
              <MetaRow icon="💰" label="1인 금액">
                <span className="font-bold text-[#4F46E5] text-base">{program.pricePerPerson}</span>
              </MetaRow>
            )}
            {capacityLines.length > 0 && (
              <MetaRow icon="👥" label="수용인원">
                <div className="space-y-0.5 text-white/80">
                  {capacityLines.map((line, i) => <div key={i}>{line}</div>)}
                </div>
              </MetaRow>
            )}
            {program.duration && (
              <MetaRow icon="⏱" label="소요시간">
                <span className="text-white/80">{program.duration}</span>
              </MetaRow>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {program.blocks.length > 0 ? (
            <div>{program.blocks.map(renderBlock)}</div>
          ) : (
            <p className="text-gray-400 text-center py-12">상세 내용이 준비 중입니다.</p>
          )}
        </div>

        {/* 문의 CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/#contact"
            className="inline-block bg-[#4F46E5] hover:bg-[#4338CA] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg"
          >
            이 프로그램 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
