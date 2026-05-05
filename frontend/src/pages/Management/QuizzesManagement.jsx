import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout/";
import { CreateButton } from "@/components/Common/ActionButtons/";
import { useNavigate } from "react-router-dom";
import { useQuizzesForTeacher } from "@/hooks/Quizzes/useQuizzesForTeacher";
import { QuizDetailsCard } from "@/components/Quizzes/Content/";
import { 
    DeleteQuizDialog, 
    PublishQuizDialog 
} from "@/components/Quizzes/Dialogs";
import { Fragment, useState } from "react";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { 
    matchesDifficulty, 
    matchesStatus, 
    normalizeWord
} from "@/utils/search";

const QuizzesManagement = () => {
    const { quizzesForTeacher, loading, refetchTeacher } = useQuizzesForTeacher({ limit: 0 });
    const { remove, restore, publish } = useQuizActions();

    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // NAVIGATION
    const navigate = useNavigate();

    // SEARCH
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search).get("search") || "";

    const words = searchParams.toLowerCase().split(" ").filter(word => word.trim() !== "");;
    const normalizedWords = words.map(normalizeWord);

    const filteredQuizzes = quizzesForTeacher.filter(q => {
        const title = q.title?.toLowerCase() || "";

        return normalizedWords.every(word =>
            title.includes(word) ||
            matchesStatus(q.status, word) ||
            matchesDifficulty(q.difficulty, word)
        );
    });

    // TRANSLATION
    const { t } = useTranslation();

    //DIALOGS
    const [dialogs, setDialogs] = useState({
        delete: false,
        publish: false
    });

    // DIALOGS STATUS
    const openDeleteDialog = (quiz) => {
        setSelectedQuiz(quiz);
        setDialogs(prev => ({...prev, delete: true}));
    }

    const openPublishDialog = (quiz) => {
        setSelectedQuiz(quiz);
        setDialogs(prev => ({...prev, publish: true}));
    }

    const closeDialogs = () => {
        setDialogs({
            delete: false,
            publish: false
        });
    }

    // DIALOGS ACTIONS
    const handleConfirmDelete = async () => {
        try{
            await remove(selectedQuiz._id);
            closeDialogs();
            refetchTeacher({ limit: 0 });
        }catch(error){
            console.error("Error deleting quiz", error);
        }
    }

    const handleRestoreQuiz = async (quiz) => {
        try {
            await restore(quiz._id);
            refetchTeacher({ limit: 0 });
        }catch(error){
            console.error("Error restoring quiz", error);
        }
    }

    const handlePublishQuiz = async () => {
        try {
            await publish(selectedQuiz._id);
            closeDialogs();
            refetchTeacher({ limit: 0 });
        }catch(error){
            console.error("Error publishing quiz", error);
        }
    }

    const handleEditQuiz = (quiz) => {
        navigate(`/dashboard_teacher/quizzes/${quiz._id}/edit`);
    }

    const handleStartQuiz = async (quiz) => {
        navigate(`/dashboard_teacher/session/${quiz._id}`);
    }

    const handleViewResults = (quiz) => {
        navigate(`/dashboard_teacher/quizzes/${quiz._id}/sessions`);
    };

    return (
        <DashboardLayout>
            <DashboardContent>
                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label={t("common.quizzesManagement.title")} />
                       
                    <div className="pr-6 md:pr-16">
                        <CreateButton label={t("common.quizzesManagement.labelButton")} onClick={() => navigate("/dashboard_teacher/quizzes/create")}/>
                    </div>
                </div>

                <div className="mb-4">
                    {loading ? (
                        <div className="flex justify-center">
                            <Spinner className="h-10 w-10" color="blue" />
                        </div>
                    ) : filteredQuizzes.length === 0 && (
                        <p className="text-gray-500">{t("common.quizzesManagement.detailsCard.noQuizzes")}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredQuizzes.map((quiz, index) => {
                            const prevStatus = filteredQuizzes[index - 1]?.status;
                            const showDivider = index === 0 || prevStatus !== quiz.status;

                            return (
                                <Fragment key={quiz._id}>
                                    {showDivider && (
                                        <div className="col-span-full flex items-center gap-2 my-2">
                                            <div className="flex-1 h-px bg-gray-300" />
                                            <span className="text-sm font-medium text-gray-500 capitalize">
                                            {t("teacher.quizzesManagement.detailsCard." + quiz.status)}
                                            </span>
                                            <div className="flex-1 h-px bg-gray-300" />
                                        </div>
                                    )}

                                    <QuizDetailsCard 
                                        key={quiz._id} 
                                        quiz={quiz} 
                                        onClick={handleViewResults}
                                        onDelete={openDeleteDialog}  
                                        onRestore={handleRestoreQuiz}
                                        onPublish={openPublishDialog}
                                        onEdit={handleEditQuiz}
                                        onStartSession={handleStartQuiz}
                                    />
                                </Fragment>
                            )
                        })}
                    </div>
                    
                </div>

                {selectedQuiz && <DeleteQuizDialog
                    open={dialogs.delete}
                    quiz={selectedQuiz}
                    onConfirm={handleConfirmDelete}
                    onClose={closeDialogs}
                />}

                {selectedQuiz && <PublishQuizDialog
                    open={dialogs.publish}
                    quiz={selectedQuiz}
                    onConfirm={handlePublishQuiz}
                    onClose={closeDialogs}
                />}
            </DashboardContent>
        </DashboardLayout>
    );
}

export default QuizzesManagement;