/**
 * Catalogue exports for the MedHealth partner page.
 *
 * Both formats are produced entirely in the browser from the live catalogue
 * rows, so prices can never drift from what is on screen.
 */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { HOUSE, PARTNER } from "@/partners/medhealth";
import { groupOf, money, type Product } from "@/lib/medhealth-catalogue";

export interface ExportKit {
  name: string;
  items: Product[];
  subtotal: number;
}

export interface ExportContext {
  /** Category filter in play, or "All". */
  filter: string;
  /** Free text search in play, if any. */
  query?: string;
}

const TITLE = "Assistive Technology Catalogue";
const SUBTITLE = "Prepared by Supply Ministry for the MedHealth team";
const CONTACT = "0404 593 090   |   david@supplyministry.com.au   |   supplyministry.com.au";

const today = () => new Date().toISOString().slice(0, 10);
const fileStem = () => `supply-ministry-medhealth-catalogue-${today()}`;

const longDate = () =>
  new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

const contextLine = (ctx: ExportContext) => {
  const bits: string[] = [];
  bits.push(ctx.filter && ctx.filter !== "All" ? `Category: ${ctx.filter}` : "All categories");
  if (ctx.query?.trim()) bits.push(`Search: "${ctx.query.trim()}"`);
  bits.push(longDate());
  return bits.join("   |   ");
};

/** Groups products by their clinical group, in a stable, readable order. */
function byGroup(products: Product[]) {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const g = groupOf(p);
    map.set(g, [...(map.get(g) ?? []), p]);
  }
  return [...map.entries()]
    .map(([g, items]) => [g, [...items].sort((a, b) => a.product_name.localeCompare(b.product_name))] as const)
    .sort((a, b) => a[0].localeCompare(b[0]));
}

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

const VIOLET = hexToRgb(HOUSE.violet);
const INK = hexToRgb(HOUSE.ink);

/** Loads a /public image as a data URL so jsPDF can embed it. */
async function loadImage(src: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    const data: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = data;
    });
    return { data, ...dims };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- PDF

export async function exportCataloguePdf(
  products: Product[],
  kits: ExportKit[],
  ctx: ExportContext,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;

  const [sm, mh] = await Promise.all([
    loadImage("/Supply_Ministry_logo_new_cropped.png"),
    loadImage(PARTNER.logo),
  ]);

  /** The house brand rule, drawn across the very top of every page. */
  const drawRule = () => {
    const segs: Array<[string, number, number]> = [
      [HOUSE.violet, 0, 0.22],
      [PARTNER.circle.blue, 0.22, 0.48],
      [PARTNER.circle.red, 0.48, 0.74],
      [PARTNER.circle.amber, 0.74, 1],
    ];
    for (const [hex, from, to] of segs) {
      const [r, g, b] = hexToRgb(hex);
      doc.setFillColor(r, g, b);
      doc.rect(pageW * from, 0, pageW * (to - from), 2, "F");
    }
  };

  let y = 0;

  const header = () => {
    drawRule();
    y = 18;
    if (sm) {
      const h = 11;
      doc.addImage(sm.data, "PNG", margin, y - 8, (sm.w / sm.h) * h, h);
    }
    if (mh) {
      const h = 9;
      const w = (mh.w / mh.h) * h;
      doc.addImage(mh.data, "PNG", pageW - margin - w, y - 7, w, h);
    }
    y += 12;

    doc.setTextColor(...VIOLET);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(TITLE, margin, y);

    y += 6;
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(SUBTITLE, margin, y);

    y += 5;
    doc.setFontSize(8.5);
    doc.setTextColor(120, 118, 118);
    doc.text(contextLine(ctx), margin, y);

    y += 6;
  };

  header();

  const table = (head: string[], body: Array<Array<string>>, startY: number) => {
    autoTable(doc, {
      head: [head],
      body,
      startY,
      margin: { left: margin, right: margin, top: 14, bottom: 20 },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.2, textColor: INK, lineColor: [225, 222, 232] },
      headStyles: { fillColor: VIOLET, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      alternateRowStyles: { fillColor: [250, 248, 244] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 42 },
        2: { cellWidth: 24, halign: "right" },
      },
      didDrawPage: () => drawRule(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).lastAutoTable.finalY as number;
  };

  const sectionHeading = (text: string) => {
    if (y > doc.internal.pageSize.getHeight() - 45) {
      doc.addPage();
      drawRule();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...VIOLET);
    doc.text(text, margin, y);
    y += 3;
  };

  for (const [group, items] of byGroup(products)) {
    sectionHeading(group);
    y = table(
      ["Product", "Code", "Price"],
      items.map((p) => [p.product_name, p.product_code, p.price_rrp == null ? "" : money(p.price_rrp)]),
      y + 2,
    ) + 10;
  }

  if (kits.length) {
    doc.addPage();
    drawRule();
    y = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...VIOLET);
    doc.text("Clinical kits", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 118, 118);
    doc.text("Ready-made selections for common daily-living needs.", margin, y);
    y += 6;

    for (const kit of kits) {
      sectionHeading(`${kit.name}   ${money(kit.subtotal)}`);
      y = table(
        ["Product", "Code", "Price"],
        kit.items.map((p) => [p.product_name, p.product_code, p.price_rrp == null ? "" : money(p.price_rrp)]),
        y + 2,
      ) + 9;
    }
  }

  // Footer on every page, added last so the page count is final.
  const pages = doc.getNumberOfPages();
  const pageH = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(225, 222, 232);
    doc.line(margin, pageH - 14, pageW - margin, pageH - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 118, 118);
    doc.text(`${PARTNER.disclaimer}`, margin, pageH - 10);
    doc.text(CONTACT, margin, pageH - 6.5);
    doc.text(`Page ${i} of ${pages}`, pageW - margin, pageH - 6.5, { align: "right" });
  }

  doc.save(`${fileStem()}.pdf`);
}

// -------------------------------------------------------------- Excel

/* eslint-disable @typescript-eslint/no-explicit-any */

const argb = (hex: string) => `FF${hex.replace("#", "").toUpperCase()}`;
const CREAM = "FFFAF8F4";
const RULE = "FFE1DEE8";
const MUTED = "FF787676";

/**
 * Excel export, styled to match the PDF: brand rule, both logos, violet
 * headings and the same disclaimer and contact line.
 */
export async function exportCatalogueXlsx(
  products: Product[],
  kits: ExportKit[],
  ctx: ExportContext,
) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Supply Ministry";
  wb.created = new Date();

  const [sm, mh] = await Promise.all([
    loadImage("/Supply_Ministry_logo_new_cropped.png"),
    loadImage(PARTNER.logo),
  ]);

  const smId = sm ? wb.addImage({ base64: sm.data.split(",")[1], extension: "png" }) : null;
  const mhId = mh ? wb.addImage({ base64: mh.data.split(",")[1], extension: "png" }) : null;

  /** Brand rule, logos, title block. Returns the first free row. */
  const brandHeader = (ws: any, heading: string, sub: string) => {
    ws.getColumn(1).width = 28;
    ws.getColumn(2).width = 52;
    ws.getColumn(3).width = 28;
    ws.getColumn(4).width = 14;

    // Row 1: the four-colour house rule.
    const rule = ws.getRow(1);
    rule.height = 5;
    const segs = [HOUSE.violet, PARTNER.circle.blue, PARTNER.circle.red, PARTNER.circle.amber];
    segs.forEach((hex, i) => {
      rule.getCell(i + 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(hex) } };
    });

    ws.getRow(2).height = 42;
    if (smId != null) {
      ws.addImage(smId, { tl: { col: 0.2, row: 1.2 }, ext: { width: 150, height: (150 * sm!.h) / sm!.w } });
    }
    if (mhId != null) {
      ws.addImage(mhId, { tl: { col: 3.05, row: 1.25 }, ext: { width: 96, height: (96 * mh!.h) / mh!.w } });
    }

    ws.mergeCells("A3:D3");
    const t = ws.getCell("A3");
    t.value = heading;
    t.font = { name: "Arial", size: 16, bold: true, color: { argb: argb(HOUSE.violet) } };
    ws.getRow(3).height = 24;

    ws.mergeCells("A4:D4");
    const s = ws.getCell("A4");
    s.value = sub;
    s.font = { name: "Arial", size: 10, color: { argb: argb(HOUSE.ink) } };

    ws.mergeCells("A5:D5");
    const c = ws.getCell("A5");
    c.value = contextLine(ctx);
    c.font = { name: "Arial", size: 9, color: { argb: MUTED } };

    return 7;
  };

  const headerRow = (ws: any, rowIdx: number, labels: string[]) => {
    const row = ws.getRow(rowIdx);
    labels.forEach((label, i) => {
      const cell = row.getCell(i + 1);
      cell.value = label;
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(HOUSE.violet) } };
      cell.alignment = { vertical: "middle", horizontal: i === 3 ? "right" : "left" };
    });
    row.height = 20;
    row.commit();
  };

  const bodyRow = (ws: any, rowIdx: number, values: Array<string | number | null>, band: boolean) => {
    const row = ws.getRow(rowIdx);
    values.forEach((v, i) => {
      const cell = row.getCell(i + 1);
      cell.value = v;
      cell.font = { name: "Arial", size: 10, color: { argb: argb(HOUSE.ink) } };
      if (band) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CREAM } };
      cell.border = { bottom: { style: "thin", color: { argb: RULE } } };
      if (i === 3) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: "right" };
      } else {
        cell.alignment = { vertical: "top", wrapText: i === 1 };
      }
    });
    row.commit();
  };

  const footer = (ws: any, rowIdx: number) => {
    ws.mergeCells(`A${rowIdx}:D${rowIdx}`);
    const d = ws.getCell(`A${rowIdx}`);
    d.value = PARTNER.disclaimer;
    d.font = { name: "Arial", size: 8, color: { argb: MUTED } };
    ws.mergeCells(`A${rowIdx + 1}:D${rowIdx + 1}`);
    const c = ws.getCell(`A${rowIdx + 1}`);
    c.value = CONTACT;
    c.font = { name: "Arial", size: 8, color: { argb: MUTED } };
  };

  // ---- Catalogue sheet
  const ws = wb.addWorksheet("Catalogue", {
    views: [{ state: "frozen", ySplit: 7 }],
    pageSetup: { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  let r = brandHeader(ws, TITLE, SUBTITLE);
  headerRow(ws, r, ["Category", "Product", "Code", "Price"]);
  const firstBody = r + 1;
  r = firstBody;
  let band = false;
  for (const [group, items] of byGroup(products)) {
    for (const p of items) {
      bodyRow(ws, r, [group, p.product_name, p.product_code, p.price_rrp == null ? null : Math.round(p.price_rrp)], band);
      band = !band;
      r += 1;
    }
  }
  ws.autoFilter = { from: { row: firstBody - 1, column: 1 }, to: { row: r - 1, column: 4 } };
  footer(ws, r + 1);

  // ---- Clinical kits sheet
  if (kits.length) {
    const kws = wb.addWorksheet("Clinical kits", {
      views: [{ state: "frozen", ySplit: 7 }],
      pageSetup: { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });
    let kr = brandHeader(kws, "Clinical kits", "Ready-made selections for common daily-living needs.");
    headerRow(kws, kr, ["Kit", "Product", "Code", "Price"]);
    kr += 1;
    for (const kit of kits) {
      let b = false;
      for (const p of kit.items) {
        bodyRow(kws, kr, [kit.name, p.product_name, p.product_code, p.price_rrp == null ? null : Math.round(p.price_rrp)], b);
        b = !b;
        kr += 1;
      }
      const sub = kws.getRow(kr);
      sub.getCell(2).value = `${kit.name} subtotal`;
      sub.getCell(4).value = Math.round(kit.subtotal);
      sub.getCell(4).numFmt = '$#,##0';
      for (let c = 1; c <= 4; c += 1) {
        sub.getCell(c).font = { name: "Arial", size: 10, bold: true, color: { argb: argb(HOUSE.violet) } };
        sub.getCell(c).border = { top: { style: "thin", color: { argb: argb(HOUSE.violet) } } };
        sub.getCell(c).alignment = { horizontal: c === 4 ? "right" : "left" };
      }
      sub.commit();
      kr += 2;
    }
    footer(kws, kr);
  }

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileStem()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
