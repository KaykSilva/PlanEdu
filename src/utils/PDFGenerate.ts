import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateLessonPlanPDF(formData) {
    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let currentY = 100;

    // Cabeçalho com estilo similar ao documento
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MODELO DE PLANO DE ENSINO", pageWidth / 2, 30, { align: "center" });

    // ID do documento
    doc.setFont("Times", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`ID: ${formData.id || Date.now()}`, margin, 70);
    doc.text(`Sistema: PLanEdu`, pageWidth - margin, 70, { align: "right" });

    // Linha decorativa
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(margin, 85, pageWidth - margin, 85);

    // Função auxiliar para tabelas estilizadas com espaçamento reduzido
    const addSection = (title, content, startY) => {
        if (!content || content === "-") return startY;

        autoTable(doc, {
            startY: startY,
            head: [[title]],
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: 0,
                fontStyle: "bold",
                halign: "left",
                fontSize: 11,
                cellPadding: 4,
            },
            body: [[Array.isArray(content) ? content.join("\n") : content]],
            bodyStyles: {
                valign: "top",
                cellPadding: 6,
                fontSize: 10,
                minCellHeight: 15,
            },
            styles: {
                lineWidth: 0.1,
                lineColor: [100, 100, 100],
                cellWidth: "wrap",
                overflow: "linebreak",
            },
            theme: "grid",
            margin: { left: margin, right: margin },
            tableLineWidth: 0.1,
        });

        // Retorna a nova posição Y após a tabela
        return doc.lastAutoTable.finalY + 8;
    };

    // Função para processar conteúdo dinâmico
    const processContent = (content) => {
        if (!content) return "-";
        if (Array.isArray(content)) {
            const filtered = content.filter(item => item !== null && item !== undefined && item !== "");
            return filtered.length > 0 ? filtered.join("\n") : "-";
        }
        return content.toString();
    };

    // Informações básicas da disciplina no formato de tabela
    const basicInfo = [];

    // Título e Disciplina
    basicInfo.push([
        "Título:",
        formData.title || "-",
        "Disciplina:",
        formData.subject || "-"
    ]);

    // Série/Ano e Duração
    basicInfo.push([
        "Série / Ano:",
        formData.grade || "-",
        "Duração:",
        formData.duration || "-"
    ]);

    // Data
    basicInfo.push([
        "Data:",
        formData.date || "-",
        "",
        ""
    ]);

    autoTable(doc, {
        startY: currentY,
        body: basicInfo,
        styles: {
            fontSize: 10,
            cellPadding: 4,
            minCellHeight: 18,
        },
        margin: { left: margin, right: margin },
        theme: "grid",
        tableLineWidth: 0.1,
    });

    currentY = doc.lastAutoTable.finalY + 8;

    // Seções mapeadas dos campos do formData
    const sections = [
        { key: 'objectives', title: 'OBJETIVOS' },
        { key: 'content', title: 'CONTEÚDO' },
        { key: 'methodology', title: 'METODOLOGIA' },
        { key: 'resources', title: 'RECURSOS DIDÁTICOS' },
        { key: 'evaluation', title: 'AVALIAÇÃO' },
        { key: 'homework', title: 'TAREFA DE CASA' },
    ];

    // Adiciona apenas as seções que existem no formData e têm conteúdo
    sections.forEach(section => {
        const content = processContent(formData[section.key]);
        if (content && content !== "-") {
            // Verifica se precisa adicionar nova página
            if (currentY > 650) {
                doc.addPage();
                currentY = margin;
            }

            currentY = addSection(section.title, content, currentY);
        }
    });

    // Adicionar seções customizadas para quaisquer outros campos que possam existir
    const customFields = ['observations', 'references', 'activities', 'competences'];
    customFields.forEach(key => {
        if (formData[key] && processContent(formData[key]) !== "-") {
            if (currentY > 650) {
                doc.addPage();
                currentY = margin;
            }

            const sectionTitle = key.toUpperCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            currentY = addSection(sectionTitle, processContent(formData[key]), currentY);
        }
    });

    // Data de criação
    if (formData.createdAt) {
        if (currentY > 700) {
            doc.addPage();
            currentY = margin;
        }

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
            `Criado em: ${new Date(formData.createdAt).toLocaleString('pt-BR')}`,
            margin,
            currentY
        );
        currentY += 15;
    }

    // Assinaturas (com espaçamento reduzido)
    if (currentY > 600) {
        doc.addPage();
        currentY = margin;
    }

    const assinaturasBody = [
        ["Professor da Disciplina: _____", "Assinatura: _____"],
        ["Coordenador Pedagógico: _____", "Assinatura: _____"]
    ];

    autoTable(doc, {
        startY: currentY,
        body: assinaturasBody,
        styles: {
            fontSize: 10,
            cellPadding: 6,
            minCellHeight: 20,
        },
        margin: { left: margin, right: margin },
        theme: "grid",
        tableLineWidth: 0.1,
    });

    // Rodapé com identificação do sistema
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
        `Sistema PLanEdu - Documento gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
    );

    // Nome do arquivo
    const filename = formData.title
        ? `${formData.title.replace(/\s+/g, "-")}-plano-educacional.pdf`
        : "plano-educacional.pdf";

    doc.save(filename);
}