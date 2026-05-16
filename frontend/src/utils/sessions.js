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
    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 15;

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - marginLeft - marginRight;

    let y = marginTop;

    const resetColor = () => doc.setTextColor(0, 0, 0);

    // Function to check if we need to add a page break
    const checkPageBreak = (spaceNeeded = 10) => {
        if (y + spaceNeeded > pageHeight - marginBottom) {
            doc.addPage();
            y = marginTop;
        }
    };

    const studentName = session.results?.playerId?.fullName || session.results?.playerId?.username || t("common.sessionHistory.sessionReview.unknownStudent");
    const studentEmail = session.results?.playerId?.email || "-";

    const points = session.results?.totalScore || 0;
    const totalPoints = session.questions?.reduce(
        (acc, q) => acc + (q.questionSnapshot.points || 0),
        0
    ) || 0;

    const responseMap = new Map(
        session.responses?.map(r => [r.questionId?.toString(), r]) || []
    );

    // Header
    doc.setFontSize(20);

    doc.text(
        quiz.title,
        pageWidth / 2,
        y,
        { align: "center" }
    );
    y += 8;

    doc.setFontSize(16);
    doc.text(
        t("common.sessionHistory.sessionReview.title", { 
            quizTitle: quiz.title 
        }), 
        pageWidth / 2, 
        y,
        { align: "center" }
    );
    y += 10;

    // Student section
    doc.setFontSize(12);
    
    doc.text(
        t("common.sessionHistory.sessionReview.studentData"), 
        marginLeft, 
        y
    ); 
    y += 8;

    doc.setFontSize(10);
    
    doc.text(
        t("common.sessionHistory.sessionReview.studentName", { 
            studentName: studentName
        }), 
        marginLeft, 
        y
    ); 
    y += 6;

    doc.text(
        t("common.sessionHistory.sessionReview.studentEmail", { 
            studentEmail: studentEmail
        }), 
        marginLeft, 
        y
    ); 
    y += 12;

    // Session section
    doc.setFontSize(12);

    doc.text(
        t("common.sessionHistory.sessionReview.sessionData"), 
        marginLeft, 
        y
    ); 
    y += 8;
    
    doc.setFontSize(10);

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
    y += 12;

    // Questions and answers
    session.questions.forEach((question, index) => {
        const response = responseMap.get(question.originalQuestionId?.toString());

        const selected = response?.answer || null;

        checkPageBreak(60);

        // Question title
        doc.setFont("DejaVuSans", "bold");

        const titleLines = doc.splitTextToSize(
            `${index + 1}. ${question.questionSnapshot.text} (${
                t("common.sessionHistory.sessionReview.pointsPerQuestion", { 
                    points: question.questionSnapshot.points 
                })
            }).`,
            maxWidth
        );

        doc.text(titleLines, marginLeft, y);
        y += titleLines.length * 6 + 4;

        // Options
        doc.setFont("DejaVuSans", "normal");

        question.questionSnapshot.options.forEach((option) => {
            const estimatedBlockHeight = 10 + question.questionSnapshot.options.length * 6 + 10;

            checkPageBreak(estimatedBlockHeight);

            const isCorrect = option.isCorrect;
            const isSelected = selected && option.letter === selected;

            // Color logic
            if (isCorrect) doc.setTextColor(0, 160, 0); // Green for correct 
            else if (isSelected) doc.setTextColor(255, 0, 0); // Red for incorrect selected
            else doc.setTextColor(120); // Gray for others
            

            // Mark correct answers
            const prefix = isCorrect ? "✔ " : "   ";

            let line = `${prefix}${option.letter}. ${option.text}.`;

            // Mark selected answer
            if (isSelected) {
                line += ` ← ${
                    t("common.sessionHistory.sessionReview.yourAnswer")
                }`;
            }

            // Add line to PDF
            doc.text(line, marginLeft + 6, y); 
            y += 6;

            // Reset color
            resetColor();
        });

        y += 8;
    });

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);

        const footerText = `${quiz.title} · Page ${i} of ${pageCount}`;

        doc.text(
            footerText,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
    }

    // Save PDF
    const date = new Date(session.startTime).toISOString().split("T")[0];

    doc.save(`session_review_${date}.pdf`
    );
}

export const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
        ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        : `${minutes}:${seconds.toString().padStart(2, "0")}`;
};