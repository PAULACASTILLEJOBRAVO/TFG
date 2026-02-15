import DashboardSubtitle from "@/components/Dashboard/Layout/Content/DashboardSubtitle";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";
import CreateButton from "@/components/Common/ActionButtons/CreateButton";
import { useNavigate } from "react-router-dom";
import { useQuizzes } from "@/hooks/Quizzes/useQuizzes";
import QuizDetailsCard from "@/components/Quizzes/Content/QuizDetailsCard";
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import DeleteQuizDialog from "@/components/Quizzes/Dialogs/DeleteQuizDialog";
import PublishQuizDialog from "@/components/Quizzes/Dialogs/PublishQuizDialog";
import { useState } from "react";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { Spinner } from "@/components/ui/spinner";

const QuizzesManagement = () => {
    const { user } = useAuth();
    if (!user) return null;

    const { quizzes, loading, refetch } = useQuizzes();
    const { remove, restore, publish } = useQuizActions();
    const { difficulties } = useDifficulties();

    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // NAVIGATION
    const navigate = useNavigate();

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
    const handleConfirmDelete = async (reason) => {
        try{
            await remove(selectedQuiz._id, {reason: reason});
            closeDialogs();
            refetch();
        }catch(error){
            console.log("Error deleting quiz", error);
        }
    }

    const handleRestoreQuiz = async (quiz) => {
        try {
            await restore(quiz._id);
            refetch();
        }catch(error){
            console.log("Error restoring quiz", error);
        }
    }

    const handlePublishQuiz = async () => {
        try {
            await publish(selectedQuiz._id);
            closeDialogs();
            refetch();
        }catch(error){
            console.log("Error publishing quiz", error);
        }
    }

    const handleEditQuiz = (quiz) => {
        navigate(`/dashboard_teacher/quizzes/${quiz._id}/edit`);
    }

    return (
        <DashboardLayout>
            <DashboardContent>
                <div className="flex items-center mb-4 justify-between">
                    <DashboardSubtitle label="Mis cuestionarios" />
                       
                    <div className="pr-6 md:pr-16">
                        <CreateButton label="cuestionario" onClick={() => navigate("/dashboard_teacher/quizzes/create")}/>
                    </div>
                </div>

                <div className="mb-4">
                  
                {loading ? (
                    <div className="flex justify-center">
                        <Spinner className="h-10 w-10" color="blue" />
                    </div>
                ) : quizzes.length === 0 && (
                    <p className="text-gray-500">No tienes cuestionarios creados.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {quizzes.map((quiz) => (
                        <QuizDetailsCard 
                            key={quiz._id} 
                            quiz={quiz} 
                            difficulties={difficulties} 
                            onDelete={openDeleteDialog}  
                            onRestore={handleRestoreQuiz}
                            onPublish={openPublishDialog}
                            onEdit={handleEditQuiz}
                        />
                    ))}
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