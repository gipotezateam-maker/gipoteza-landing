import PDFDocument from "pdfkit";

export interface Slide {
  title: string;
  content: string[];
  type?: "cover" | "content" | "closing";
}

export interface PresentationData {
  title: string;
  slides: Slide[];
}

// Color palette
const C = {
  bg: "#0D0D0D",
  accent: "#E63946",
  white: "#FFFFFF",
  gray: "#AAAAAA",
  lightGray: "#CCCCCC",
  darkGray: "#1A1A1A",
  cardBg: "#1E1E1E",
};

function hex(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function bg(doc: PDFKit.PDFDocument, color: string) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(hex(color));
}

function bar(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, color = C.accent) {
  doc.rect(x, y, w, h).fill(hex(color));
}

function card(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number) {
  doc.roundedRect(x, y, w, h, 6).fill(hex(C.cardBg));
}

export function parsePresentationFromText(text: string, topic: string): PresentationData {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const slides: Slide[] = [];

  // Cover
  slides.push({ type: "cover", title: topic, content: ["Маркетинговая презентация", "Подготовлено MarketOS · gipoteza-agency.ru"] });

  let current: Slide | null = null;

  for (const line of lines) {
    const isHeader =
      (line.endsWith(":") && !line.startsWith("-") && !line.startsWith("•") && line.length < 100) ||
      /^(\d+[\.\)])\s+[А-ЯA-Z]/.test(line) ||
      /^#{1,3}\s/.test(line);

    if (isHeader) {
      if (current && current.title) slides.push(current);
      const title = line.replace(/^#+\s*/, "").replace(/^(\d+[\.\)])\s+/, "").replace(/:$/, "").trim();
      current = { title, content: [], type: "content" };
    } else if (current) {
      const cleaned = line.replace(/^[-•*]\s+/, "").replace(/^\d+\.\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1").trim();
      if (cleaned.length > 2 && cleaned.length < 150) {
        current.content.push(cleaned);
      }
    } else {
      // Before first header
      current = { title: "Обзор", content: [], type: "content" };
      const cleaned = line.replace(/^[-•*]\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1").trim();
      if (cleaned.length > 2) current.content.push(cleaned);
    }
  }

  if (current && current.title) slides.push(current);

  // Closing
  slides.push({ type: "closing", title: "Спасибо!", content: ["Создано с помощью MarketOS", "gipoteza-agency.ru"] });

  return { title: topic, slides };
}

export async function generatePresentationPDF(data: PresentationData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0, info: { Title: data.title, Author: "MarketOS" } });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width;
    const H = doc.page.height;

    data.slides.forEach((slide, idx) => {
      if (idx > 0) doc.addPage();

      if (slide.type === "cover") {
        renderCover(doc, slide, W, H);
      } else if (slide.type === "closing") {
        renderClosing(doc, slide, W, H);
      } else {
        renderContent(doc, slide, W, H, idx, data.slides.length);
      }
    });

    doc.end();
  });
}

function renderCover(doc: PDFKit.PDFDocument, slide: Slide, W: number, H: number) {
  bg(doc, C.bg);
  bar(doc, 0, 0, 8, H);

  // Decorative circle
  doc.circle(W - 100, H / 2, 200).fillOpacity(0.06).fill(hex(C.accent));
  doc.fillOpacity(1);

  // Logo label
  doc.font("Helvetica-Bold").fontSize(12).fillColor(C.accent).text("МАРКЕТОС", 60, 48);
  bar(doc, 60, 68, 70, 3);

  // Title
  const fs = slide.title.length > 45 ? 30 : 38;
  doc.font("Helvetica-Bold").fontSize(fs).fillColor(C.white).text(slide.title, 60, H / 2 - 70, { width: W - 200, lineGap: 6 });

  // Subtitle lines
  slide.content.forEach((line, i) => {
    doc.font("Helvetica").fontSize(15).fillColor(C.gray).text(line, 60, H / 2 + 20 + i * 26, { width: W - 200 });
  });

  bar(doc, 0, H - 5, W, 5);
}

function renderContent(doc: PDFKit.PDFDocument, slide: Slide, W: number, H: number, idx: number, total: number) {
  bg(doc, C.bg);
  bar(doc, 0, 0, W, 5);

  // Header band
  doc.rect(0, 0, W, 82).fill(hex(C.darkGray));

  // Slide number
  doc.font("Helvetica").fontSize(10).fillColor(C.gray).text(`${idx} / ${total - 1}`, W - 70, 16);

  // Title
  const titleFs = slide.title.length > 55 ? 20 : 26;
  doc.font("Helvetica-Bold").fontSize(titleFs).fillColor(C.white).text(slide.title, 50, 24, { width: W - 120 });

  // Content cards
  const items = slide.content.slice(0, 8);
  if (items.length === 0) {
    bar(doc, 0, H - 4, W, 4);
    return;
  }

  const startY = 100;
  const useTwo = items.length >= 4;
  const colW = useTwo ? (W - 120) / 2 : W - 100;
  const col1Count = useTwo ? Math.ceil(items.length / 2) : items.length;

  items.forEach((text, i) => {
    const col = useTwo && i >= col1Count ? 1 : 0;
    const rowIdx = col === 0 ? i : i - col1Count;
    const x = 50 + col * (colW + 20);
    const y = startY + rowIdx * 58;

    if (y + 50 > H - 30) return;

    card(doc, x, y, colW, 48);
    doc.circle(x + 18, y + 24, 5).fill(hex(C.accent));

    const fs = text.length > 90 ? 10 : text.length > 60 ? 12 : 13;
    doc.font("Helvetica").fontSize(fs).fillColor(C.lightGray).text(text, x + 34, y + 12, { width: colW - 48, height: 28, ellipsis: true });
  });

  bar(doc, 0, H - 4, W, 4);
  doc.font("Helvetica").fontSize(8).fillColor(C.gray).text("MarketOS · gipoteza-agency.ru", 50, H - 20);
}

function renderClosing(doc: PDFKit.PDFDocument, slide: Slide, W: number, H: number) {
  bg(doc, C.bg);
  bar(doc, 0, 0, 8, H);

  doc.circle(W / 2, H / 2, 200).fillOpacity(0.05).fill(hex(C.accent));
  doc.fillOpacity(1);

  doc.font("Helvetica-Bold").fontSize(40).fillColor(C.white).text(slide.title, 0, H / 2 - 60, { align: "center", width: W });

  bar(doc, (W - 90) / 2, H / 2 + 10, 90, 3);

  slide.content.forEach((line, i) => {
    doc.font("Helvetica").fontSize(16).fillColor(C.gray).text(line, 0, H / 2 + 30 + i * 28, { align: "center", width: W });
  });

  bar(doc, 0, H - 5, W, 5);
}
