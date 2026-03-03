import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = process.env.NOTION_DB_ID!;

export interface Program {
  id: string;
  title: string;
  category: string;
  programType: string[];
  purpose: string[];
  capacity: string;
  duration: string;
  pricePerPerson: string;
  regions: string[];
  coverUrl: string | null;
  status: string;
}

export interface ProgramDetail extends Program {
  keywords: string;
  subCategory: string[];
  notionUrl: string | null;
  blocks: BlockObjectResponse[];
}

function extractProgram(page: PageObjectResponse): Program {
  const props = page.properties;

  const title =
    props["제목"]?.type === "title"
      ? props["제목"].title.map((t) => t.plain_text).join("")
      : "";

  const category =
    props["카테고리"]?.type === "select"
      ? props["카테고리"].select?.name ?? ""
      : "";

  const programType =
    props["프로그램 유형"]?.type === "multi_select"
      ? props["프로그램 유형"].multi_select.map((o) => o.name)
      : [];

  const purpose =
    props["목적"]?.type === "multi_select"
      ? props["목적"].multi_select.map((o) => o.name)
      : [];

  const capacity =
    props["수용인원"]?.type === "rich_text"
      ? props["수용인원"].rich_text.map((t) => t.plain_text).join("")
      : "";

  const duration =
    props["소요시간"]?.type === "rich_text"
      ? props["소요시간"].rich_text.map((t) => t.plain_text).join("")
      : "";

  const pricePerPerson =
    props["1인 금액"]?.type === "rich_text"
      ? props["1인 금액"].rich_text.map((t) => t.plain_text).join("")
      : "";

  const regions =
    props["출강가능지역"]?.type === "multi_select"
      ? props["출강가능지역"].multi_select.map((o) => o.name)
      : [];

  const status =
    props["상태 1"]?.type === "status"
      ? props["상태 1"].status?.name ?? ""
      : "";

  const cover = page.cover;
  const coverUrl =
    cover?.type === "file"
      ? cover.file.url
      : cover?.type === "external"
      ? cover.external.url
      : null;

  return {
    id: page.id,
    title,
    category,
    programType,
    purpose,
    capacity,
    duration,
    pricePerPerson,
    regions,
    coverUrl,
    status,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionFilter = any;

export async function getPrograms(programType?: string): Promise<Program[]> {
  const filter: NotionFilter = programType
      ? {
          and: [
            { property: "상태 1", status: { equals: "신청가능" } },
            {
              property: "프로그램 유형",
              multi_select: { contains: programType },
            },
          ],
        }
      : { property: "상태 1", status: { equals: "신청가능" } };

  const results: Program[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: DB_ID,
      filter,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (page.object === "page" && "properties" in page) {
        results.push(extractProgram(page as PageObjectResponse));
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return results;
}

export async function getProgramDetail(id: string): Promise<ProgramDetail | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: id })) as PageObjectResponse;
    const base = extractProgram(page);

    const props = page.properties;

    const keywords =
      props["키워드"]?.type === "rich_text"
        ? props["키워드"].rich_text.map((t) => t.plain_text).join("")
        : "";

    const subCategory =
      props["중분류"]?.type === "multi_select"
        ? props["중분류"].multi_select.map((o) => o.name)
        : [];

    const notionUrl =
      props["URL"]?.type === "url" ? props["URL"].url : null;

    // Fetch page content blocks
    const blocksResponse = await notion.blocks.children.list({ block_id: id });
    const blocks = blocksResponse.results.filter(
      (b): b is BlockObjectResponse => b.object === "block"
    );

    return { ...base, keywords, subCategory, notionUrl, blocks };
  } catch {
    return null;
  }
}
