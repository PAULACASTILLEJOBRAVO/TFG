import { DashboardSubtitle } from "@/components/Dashboard/Layout/Content";
import { 
    DashboardContent, 
    DashboardLayout 
} from "@/components/Dashboard/Layout/";
import { CreateButton } from "@/components/Common/ActionButtons/";
import { useNavigate } from "react-router-dom";
import { useQuizzes } from "@/hooks/Quizzes/useQuizzes";
import { QuizDetailsCard } from "@/components/Quizzes/Content/";
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import { 
    DeleteQuizDialog, 
    PublishQuizDialog 
} from "@/components/Quizzes/Dialogs";
import { useState } from "react";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { Spinner } from "@/components/ui/spinner";
import { useCoordinatorSerial } from "@/hooks/Hardware/useCoordinatorSerial";

const QuizzesManagement = () => {
    const { quizzes, loading, refetch } = useQuizzes();
    const { remove, restore, publish } = useQuizActions();
    const { difficulties } = useDifficulties();
    const { connect, disconnect, reconnect, send, listen, stopListening } = useCoordinatorSerial();

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
            console.error("Error deleting quiz", error);
        }
    }

    const handleRestoreQuiz = async (quiz) => {
        try {
            await restore(quiz._id);
            refetch();
        }catch(error){
            console.error("Error restoring quiz", error);
        }
    }

    const handlePublishQuiz = async () => {
        try {
            await publish(selectedQuiz._id);
            closeDialogs();
            refetch();
        }catch(error){
            console.error("Error publishing quiz", error);
        }
    }

    const handleEditQuiz = (quiz) => {
        navigate(`/dashboard_teacher/quizzes/${quiz._id}/edit`);
    }

    const handleStartQuiz = async (quiz) => {
        // navigate(`/dashboard_teacher/quizzes/${quiz._id}/session`);
        try{
            await connect(); 

            listen((event) => {
                switch(event.type) {
                    case "SUCCESS":
                        console.log(event.raw);
                        break;

                    case "QUESTION_ACK":
                        console.log(event.raw);
                        break;

                    case "ANSWER":
                        console.log(event.raw);
                        break;

                    case "TIMEOUT":
                        console.log(event.raw);
                        break;

                    case "ERROR":
                        console.error(event.raw);
                        break;
                }
            });

            console.log("Listening started...");

        }catch(error){
            console.error("Error connecting to coordinator", error);
        }
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

                <button onClick={() => send("qa send_question 1 1 2 -1")}>
                    Test coordinator send command question with id 1, difficulty 1, and options 2, with no time limit
                </button>

                <button onClick={() => send("qa stop_question")}>
                    Test coordinator send command to stop current question
                </button>

                 <button onClick={() => send("qa send_question 2 2 4 30")}>
                    Test coordinator send command with question id 2, difficulty 2, and options 4, with a time limit of 30 seconds
                </button>

                <button onClick={() => send("qa status")}>
                    Test coordinator send command to get status
                </button>

                 {/* <button onClick={() => send("qa get_answers")}>
                    Test coordinator send command to get answers
                </button>

                 <button onClick={() => send("qa get_answers_csv")}>
                    Test coordinator send command to get answers in CSV format
                </button> */}
                  
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
                            onStartSession={handleStartQuiz}
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