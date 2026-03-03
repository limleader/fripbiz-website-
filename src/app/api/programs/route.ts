import { NextRequest, NextResponse } from "next/server";
import { getPrograms } from "@/lib/notion";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const programs = await getPrograms(type || undefined);
    return NextResponse.json({ programs });
  } catch (e) {
    console.error("Notion query error:", e);
    return NextResponse.json({ error: "프로그램을 불러올 수 없습니다." }, { status: 500 });
  }
}
