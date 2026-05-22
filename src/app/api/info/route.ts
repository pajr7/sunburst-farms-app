import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get("page");
  if (!pageId) {
    return NextResponse.json({ error: "Missing page parameter" }, { status: 400 });
  }

  const url = `https://sbfehome.com/?page_id=${pageId}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    const html = await res.text();

    const titleMatch = html.match(/<h1[^>]*class="entry-title"[^>]*>([\s\S]*?)<\/h1>/)
      || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").trim()
      : "Community Info";

    const contentMatch = html.match(/<div[^>]*class="entry-content"[^>]*>([\s\S]*?)<\/div>\s*<\/article/)
      || html.match(/<div[^>]*class="entry-content"[^>]*>([\s\S]*?)<\/div>/);

    let content = contentMatch ? contentMatch[1] : "";

    content = content
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/\sclass="[^"]*"/g, "")
      .replace(/\sstyle="[^"]*"/g, "")
      .replace(/\sid="[^"]*"/g, "")
      .replace(/\sdata-[a-z-]*="[^"]*"/g, "")
      .replace(/\swidth="[^"]*"/g, "")
      .replace(/\sheight="[^"]*"/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<div>/g, "")
      .replace(/<\/div>/g, "")
      .trim();

    content = content.replace(
      /(?<!="|'>)(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)(?!<\/a)/g,
      '<a href="mailto:$1">$1</a>'
    );

    content = content.replace(
      /(?<!="|'>)\(?\b(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b(?!<\/a)/g,
      '<a href="tel:$1$2$3">($1) $2-$3</a>'
    );

    return NextResponse.json({ title, content });
  } catch {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}
