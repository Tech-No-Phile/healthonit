"use client";

import jsPDF from "jspdf";
import showdown from "showdown";

export function downloadPDF(markdown: string, filename = "diet-plan.pdf") {
  const converter = new showdown.Converter({ tables: true });
  const html = converter.makeHtml(markdown);

  const parser = new DOMParser();
  const docHtml = parser.parseFromString(html, "text/html");
  const tableEl = docHtml.querySelector("table");

  if (!tableEl) {
    alert("No table found in the plan to export.");
    return;
  }

  const allRows = Array.from(tableEl.querySelectorAll("tr"));
  const headers = Array.from(allRows[0].querySelectorAll("th,td")).map(
    (c) => (c.textContent || "").trim()
  );
  const rows = allRows.slice(1).map((tr) =>
    Array.from(tr.querySelectorAll("td,th")).map(
      (td) => (td.textContent || "").trim()
    )
  );

  const docPdf = new jsPDF({
    orientation: headers.length > 4 ? "l" : "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = docPdf.internal.pageSize.getWidth();
  const margin = 10;
  const usableWidth = pageWidth - margin * 2;
  const colCount = headers.length;
  const colWidth = usableWidth / colCount;

  let y = margin;

  // Title
  docPdf.setFontSize(14);
  docPdf.text("Personalized Diet Plan", pageWidth / 2, y, { align: "center" });
  y += 10;

  docPdf.setFontSize(10);
  docPdf.setDrawColor(0);

  // Draw header row
  let headerHeight = 8;
  headers.forEach((header, i) => {
    docPdf.rect(margin + i * colWidth, y, colWidth, headerHeight);
    const text = docPdf.splitTextToSize(header, colWidth - 4);
    docPdf.text(text, margin + i * colWidth + 2, y + 5);
  });
  y += headerHeight;

  // Draw data rows with wrapping
  rows.forEach((row) => {
    // Determine row height based on max wrapped lines in this row
    const cellLines = row.map((cell) =>
      docPdf.splitTextToSize(cell, colWidth - 4)
    );
    const rowHeight =
      Math.max(...cellLines.map((lines) => lines.length)) * 5 + 2;

    row.forEach((cell, i) => {
      docPdf.rect(margin + i * colWidth, y, colWidth, rowHeight);
      docPdf.text(
        cellLines[i],
        margin + i * colWidth + 2,
        y + 5
      );
    });

    y += rowHeight;
  });

  docPdf.save(filename);
}
