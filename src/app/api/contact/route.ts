import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
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
