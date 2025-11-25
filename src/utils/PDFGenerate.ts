import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateLessonPlanPDF(formData) {
    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFillColor(235, 235, 235);
    doc.rect(0, 0, pageWidth, 70, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Plano de Aula", pageWidth / 2, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Documento gerado automaticamente", pageWidth / 2, 60, {
        align: "center",
    });

    // Linha decorativa
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(40, 85, pageWidth - 40, 85);

    // Função auxiliar para tabelas estilizadas
    const addSection = (title: string, content: string | string[]) => {
        autoTable(doc, {
            startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 110,
            head: [[title]],
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: 0,
                fontStyle: "bold",
                halign: "left",
            },
            body: [[Array.isArray(content) ? content.join("\n") : content]],
            bodyStyles: {
                valign: "top",
                cellPadding: 10,
                fontSize: 11,
            },
            styles: {
                lineWidth: 0.1,
                lineColor: [120, 120, 120],
                cellWidth: "wrap",
                overflow: "linebreak",
            },
            theme: "grid",
            margin: { left: 40, right: 40 },
        });
    };

    addSection("Título", formData.title || "-");
    addSection("Disciplina", formData.subject || "-");
    addSection("Série / Ano", formData.grade || "-");
    addSection("Duração", formData.duration || "-");
    addSection("Data", formData.date || "-");
    addSection("Objetivos", formData.objectives?.filter(x => x)?.join("\n") || "-");
    addSection("Conteúdo", formData.content || "-");
    addSection("Metodologia", formData.methodology || "-");
    addSection("Recursos", formData.resources || "-");
    addSection("Avaliação", formData.evaluation || "-");
    addSection("Tarefa de Casa", formData.homework || "-");

    // Rodapé
    const footer = "Documento gerado pelo sistema de planos de ensino";
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
        footer,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 25,
        { align: "center" }
    );

    // Nome do arquivo
    const filename = formData.title
        ? `${formData.title}-plano.pdf`
        : "plano-de-aula.pdf";

    doc.save(filename);
}
