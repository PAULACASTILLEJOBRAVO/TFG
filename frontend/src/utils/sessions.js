import jsPDF from "jspdf";
import { font } from "@/fonts/DejaVuSansBase64";

export const generatePDFReview = ({session, quiz, t}) => {
    const doc = new jsPDF();

    // Add DejaVu Sans font for Unicode support
    doc.addFileToVFS("DejaVuSans.ttf", font);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "bold");

    doc.setFont("DejaVuSans", "normal");

    // Margins
    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    const marginBottom = 15;

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - marginLeft - marginRight;

    let y = marginTop;

    // Header
    doc.setFontSize(16);
    doc.text(
        t("common.sessionHistory.sessionReview.title", { 
            quizTitle: quiz.title 
        }), 
        marginLeft, 
        y
    );
    y += 10;

    // Session info
    doc.setFontSize(11);

    const points = session.results?.totalScore || 0;
    const totalPoints = session.questions?.reduce(
        (acc, q) => acc + (q.questionSnapshot.points || 0),
        0
    ) || 0;

    doc.text(
        t("common.sessionHistory.sessionReview.date", { 
            date: new Date(session.startTime).toLocaleDateString() 
        }), 
        marginLeft, 
        y); 
    y += 6;
    
    doc.text(
        t("common.sessionHistory.sessionReview.correctAnswers", { 
            correct: session.results?.correctAnswers, 
            total: session.results?.totalQuestions 
        }), 
        marginLeft, 
        y
    );
    y += 6;

    doc.text(
        t("common.sessionHistory.sessionReview.points", { 
            points: points, 
            totalScore: totalPoints 
        }), 
        marginLeft, 
        y
    ); 
    y += 6;
    
    doc.text(
        t("common.sessionHistory.sessionReview.rank", { 
            rank: session.results?.rank 
        }), 
        marginLeft, 
        y
    ); 
    y += 10;


    const checkPageBreak = (spaceNeeded = 10) => {
        if (y + spaceNeeded > pageHeight - marginBottom) {
            doc.addPage();
            y = marginTop;
        }
    };

    // Questions and answers
    session.questions.forEach((question, index) => {
        const response = session.responses?.find(r => r.questionId?.toString() === question.originalQuestionId?.toString());

        const selected = response?.answer || null;

        // Question title
        doc.setFont("DejaVuSans", "bold");

        checkPageBreak(20);

        const titleLines = doc.splitTextToSize(
            `${index + 1}. ${question.questionSnapshot.text} (${
                t("common.sessionHistory.sessionReview.pointsPerQuestion", { 
                    points: question.questionSnapshot.points 
                })
            }).`,
            maxWidth
        );

        doc.text(titleLines, marginLeft, y);
        y += titleLines.length * 6;

        // Options
        doc.setFont("DejaVuSans", "normal");

        question.questionSnapshot.options.forEach((option) => {
            checkPageBreak(titleLines.length * 6 + 10);

            let line = "";

            const isCorrect = option.isCorrect;
            const isSelected = selected && option.letter === selected;

            // Color logic
            if (isCorrect && isSelected) {
                doc.setTextColor(0, 160, 0); // Green for correct
            } else if (isCorrect) {
                doc.setTextColor(0, 160, 0); // Green for correct   
            } else if (isSelected) {
                doc.setTextColor(255, 0, 0); // Red for incorrect selected
            } else {
                doc.setTextColor(120); // Gray for others
            }

            // Mark correct answers
            const prefix = isCorrect ? "✔ " : "   ";

            line = `${prefix}${option.letter}. ${option.text}.`;

            // Mark selected answer
            if (isSelected) {
                line += ` ← ${
                    t("common.sessionHistory.sessionReview.yourAnswer")
                }`;
            }

            // Add line to PDF
            doc.text(line, marginLeft + 3, y); 
            y += 6;

            // Reset color
            doc.setTextColor(0);
        });

        y += 6;
    });


    // Save PDF
    const date = new Date(session.startTime).toISOString().split("T")[0];

    doc.save(`${
        t("common.sessionHistory.sessionReview.downloadLabelPDF", { 
            date 
        })}.pdf`
    );
}