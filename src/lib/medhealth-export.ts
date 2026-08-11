/**
 * Catalogue exports for the MedHealth partner page.
 *
 * Both formats are produced entirely in the browser from the live catalogue
 * rows, so prices can never drift from what is on screen.
 */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
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
    loadImage("/Supply_Ministry_logo.png"),
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
        1: { cellWidth: 34 },
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

export function exportCatalogueXlsx(
  products: Product[],
  kits: ExportKit[],
  ctx: ExportContext,
) {
  const wb = XLSX.utils.book_new();

  const rows: Array<Array<string | number | null>> = [
    [TITLE],
    [SUBTITLE],
    [contextLine(ctx)],
    [],
    ["Category", "Product", "Code", "Price"],
  ];
  for (const [group, items] of byGroup(products)) {
    for (const p of items) {
      rows.push([group, p.product_name, p.product_code, p.price_rrp ?? null]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 26 }, { wch: 52 }, { wch: 22 }, { wch: 12 }];
  ws["!freeze"] = { xSplit: 0, ySplit: 5 };
  ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 4, c: 0 }, e: { r: rows.length - 1, c: 3 } }) };
  styleHeader(ws, 4, 4);
  currency(ws, 5, rows.length - 1, 3);
  XLSX.utils.book_append_sheet(wb, ws, "Catalogue");

  if (kits.length) {
    const kitRows: Array<Array<string | number | null>> = [["Kit", "Product", "Code", "Price"]];
    for (const kit of kits) {
      for (const p of kit.items) {
        kitRows.push([kit.name, p.product_name, p.product_code, p.price_rrp ?? null]);
      }
      kitRows.push(["", `${kit.name} subtotal`, "", kit.subtotal]);
      kitRows.push([]);
    }
    const kws = XLSX.utils.aoa_to_sheet(kitRows);
    kws["!cols"] = [{ wch: 32 }, { wch: 52 }, { wch: 22 }, { wch: 12 }];
    kws["!freeze"] = { xSplit: 0, ySplit: 1 };
    styleHeader(kws, 0, 0);
    currency(kws, 1, kitRows.length - 1, 3);
    XLSX.utils.book_append_sheet(wb, kws, "Clinical kits");
  }

  XLSX.writeFile(wb, `${fileStem()}.xlsx`);
}

function styleHeader(ws: XLSX.WorkSheet, rowStart: number, rowEnd: number) {
  for (let r = rowStart; r <= rowEnd; r += 1) {
    for (let c = 0; c <= 3; c += 1) {
      const ref = XLSX.utils.encode_cell({ r, c });
      const cell = ws[ref];
      if (!cell) continue;
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial" },
        fill: { fgColor: { rgb: HOUSE.violet.replace("#", "") } },
      };
    }
  }
}

function currency(ws: XLSX.WorkSheet, rowStart: number, rowEnd: number, col: number) {
  for (let r = rowStart; r <= rowEnd; r += 1) {
    const cell = ws[XLSX.utils.encode_cell({ r, c: col })];
    if (cell && typeof cell.v === "number") cell.z = '$#,##0.00';
  }
}
