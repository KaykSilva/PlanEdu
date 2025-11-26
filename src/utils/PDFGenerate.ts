import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import QRCode from "qrcode";

export async function generateLessonPlanPDF(formData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let currentY = 100;

  /* --------------------------------------------- *
   *                 CABEÇALHO
   * --------------------------------------------- */
  createHeader(doc, pageWidth, margin, formData);

  /* --------------------------------------------- *
   *           TABELA DE INFORMAÇÕES BÁSICAS
   * --------------------------------------------- */
  const basicInfo = buildBasicInfo(formData);

  autoTable(doc, {
    startY: currentY,
    body: basicInfo,
    styles: { fontSize: 10, cellPadding: 4, minCellHeight: 18 },
    margin: { left: margin, right: margin },
    theme: "grid",
    tableLineWidth: 0.1,
  });

  currentY = doc.lastAutoTable.finalY + 8;

  /* --------------------------------------------- *
   *               SEÇÕES PADRÃO
   * --------------------------------------------- */
  const standardSections = [
    { key: "objectives", title: "OBJETIVOS" },
    { key: "content", title: "CONTEÚDO" },
    { key: "methodology", title: "METODOLOGIA" },
    { key: "resources", title: "RECURSOS DIDÁTICOS" },
    { key: "evaluation", title: "AVALIAÇÃO" },
    { key: "homework", title: "TAREFA DE CASA" },
  ];

  for (const section of standardSections) {
    const content = processContent(formData[section.key]);
    if (content !== "-") {
      if (currentY > 650) {
        doc.addPage();
        currentY = margin;
      }

      currentY = addSection(doc, section.title, content, currentY, margin);
    }
  }

  /* --------------------------------------------- *
   *           CAMPOS CUSTOMIZADOS OPCIONAIS
   * --------------------------------------------- */
  const customFields = ["observations", "references", "activities", "competences"];

  for (const key of customFields) {
    const content = processContent(formData[key]);
    if (content !== "-") {
      if (currentY > 650) {
        doc.addPage();
        currentY = margin;
      }

      const sectionTitle = key
        .toUpperCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      currentY = addSection(doc, sectionTitle, content, currentY, margin);
    }
  }

  /* --------------------------------------------- *
   *              DATA DE CRIAÇÃO
   * --------------------------------------------- */
  if (formData.createdAt) {
    if (currentY > 700) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Criado em: ${new Date(formData.createdAt).toLocaleString("pt-BR")}`, margin, currentY);

    currentY += 15;
  }

  /* --------------------------------------------- *
   *                  QR CODE
   * --------------------------------------------- */
  if (currentY > 500) {
    doc.addPage();
    currentY = margin;
  }

  const documentId = formData.id || Date.now().toString();
  const verificationUrl = `${window.location.origin}/verify/${documentId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    currentY = addQRCodeSection(doc, qrCodeDataUrl, verificationUrl, documentId, currentY, margin);
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    currentY = addQRCodeFallback(doc, verificationUrl, documentId, currentY, margin);
  }

  /* --------------------------------------------- *
   *               ASSINATURAS
   * --------------------------------------------- */
  if (currentY > 600) {
    doc.addPage();
    currentY = margin;
  }

  const signaturesBody = [
    ["Professor da Disciplina: _____________________", "Assinatura: ____________________"],
    ["Coordenador Pedagógico: ___________________", "Assinatura: ____________________"],
  ];

  autoTable(doc, {
    startY: currentY,
    body: signaturesBody,
    styles: { fontSize: 10, cellPadding: 6, minCellHeight: 20 },
    margin: { left: margin, right: margin },
    theme: "grid",
  });

  /* --------------------------------------------- *
   *                  RODAPÉ
   * --------------------------------------------- */
  addFooter(doc);

  /* --------------------------------------------- *
   *          SALVAR DOCUMENTO NO STORAGE
   * --------------------------------------------- */
  saveDocumentToStorage(formData, documentId);

  /* --------------------------------------------- *
   *              DOWNLOAD DO ARQUIVO
   * --------------------------------------------- */
  const filename = formData.title
    ? `${formData.title.replace(/\s+/g, "-")}-plano-educacional.pdf`
    : "plano-educacional.pdf";

  doc.save(filename);
}

/* ============================================================
                      FUNÇÕES AUXILIARES
   ============================================================ */

function createHeader(doc, pageWidth, margin, formData) {
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MODELO DE PLANO DE ENSINO", pageWidth / 2, 30, { align: "center" });

  doc.setFont("Times", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);

  const id = formData.id || Date.now().toString();
  doc.text(`ID: ${id}`, margin, 70);
  doc.text("Sistema: PLanEdu", pageWidth - margin, 70, { align: "right" });

  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.line(margin, 85, pageWidth - margin, 85);
}

function buildBasicInfo(formData) {
  return [
    ["Título:", formData.title || "-", "Disciplina:", formData.subject || "-"],
    ["Série / Ano:", formData.grade || "-", "Duração:", formData.duration || "-"],
    ["Data:", formData.date || "-", "", ""],
  ];
}

function processContent(content) {
  if (!content) return "-";
  if (Array.isArray(content)) {
    const filtered = content.filter((item) => item);
    return filtered.length ? filtered.join("\n") : "-";
  }
  return content.toString();
}

function addSection(doc, title, content, startY, margin) {
  autoTable(doc, {
    startY,
    head: [[title]],
    body: [[content]],
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 0,
      fontStyle: "bold",
      halign: "left",
      fontSize: 11,
      cellPadding: 4,
    },
    bodyStyles: { valign: "top", cellPadding: 6, fontSize: 10, minCellHeight: 15 },
    styles: { lineWidth: 0.1, lineColor: [100, 100, 100], overflow: "linebreak" },
    theme: "grid",
    margin: { left: margin, right: margin },
  });

  return doc.lastAutoTable.finalY + 8;
}

function addQRCodeSection(doc, qrData, url, id, startY, margin) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VERIFICAÇÃO DE AUTENTICIDADE", margin, startY);

  startY += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("Escaneie o QR Code para verificar a autenticidade:", margin, startY);

  startY += 25;

  doc.addImage(qrData, "PNG", margin, startY, 60, 60);

  const infoX = margin + 80;

  doc.setFontSize(7);
  doc.setTextColor(80);

  doc.text("ID do Documento:", infoX, startY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(id, infoX + 55, startY + 15);

  doc.setFont("helvetica", "normal");
  doc.text("Sistema:", infoX, startY + 30);
  doc.setFont("helvetica", "bold");
  doc.text("PLanEdu", infoX + 30, startY + 30);

  doc.setFont("helvetica", "normal");
  doc.text("URL de Verificação:", infoX, startY + 45);

  const urlLines = doc.splitTextToSize(url, 200);
  doc.setFontSize(6);
  doc.text(urlLines, infoX, startY + 60);

  return startY + 80;
}

function addQRCodeFallback(doc, url, id, startY, margin) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VERIFICAÇÃO DE AUTENTICIDADE", margin, startY);

  startY += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Para verificar a autenticidade deste documento, acesse:", margin, startY);

  startY += 15;

  doc.setTextColor(0, 0, 255);
  doc.textWithLink(url, margin, startY, { url });

  startY += 20;

  doc.setTextColor(80);
  doc.setFontSize(7);
  doc.text(`ID do Documento: ${id}`, margin, startY);

  startY += 15;

  doc.text("Sistema: PLanEdu", margin, startY);

  return startY + 30;
}

function addFooter(doc) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(100);

  doc.text(
    `Sistema PLanEdu - Documento gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")}`,
    doc.internal.pageSize.getWidth() / 2,
    pageHeight - 20,
    { align: "center" }
  );
}

function saveDocumentToStorage(formData, documentId) {
  try {
    const documents = JSON.parse(localStorage.getItem("planEdu_documents") || "[]");

    const document = {
      ...formData,
      id: documentId,
      createdAt: new Date().toISOString(),
      verified: true,
      verificationUrl: `${window.location.origin}/verify/${documentId}`,
    };

    const updated = documents.filter((doc) => doc.id !== documentId);
    updated.push(document);

    localStorage.setItem("planEdu_documents", JSON.stringify(updated));
  } catch (error) {
    console.error("Erro ao salvar documento no localStorage:", error);
  }
}
