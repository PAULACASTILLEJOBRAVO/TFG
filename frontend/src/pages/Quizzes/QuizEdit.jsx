import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import AppBreadcrumb from "@/components/Common/AppBreadcrumb";
import { Separator } from "@/components/ui/separator";
import CreateHeader from "@/components/Common/CreateHeader";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import { createNewQuestion } from "@/utils/questions";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { useNavigate } from "react-router-dom";
import QuizForm from "@/components/Quizzes/Form/QuizForm";
import { useParams } from "react-router-dom";
import { useQuiz } from "@/hooks/Quizzes/useQuiz";
import { Spinner } from "@/components/ui/spinner";

const QuizEdit = () => {
  const { user } = useAuth();
  if(!user) return null;

  const { id } = useParams();
  const { quiz, loading } = useQuiz(id);

  const { difficulties } = useDifficulties();
  const { update } = useQuizActions();

  // Data
  const [editQuiz, setEditQuiz] = useState({ ...quiz });

  const navigate = useNavigate();

  const handleUpdate = (field, value) => {
    setEditQuiz(prev => ({...prev, [field]: value}));
  }

  const handleEditQuiz = async () => {
    try {
      await update(id, {quizFields: editQuiz, questions: questionsList});
      navigate("/dashboard_teacher/quizzes");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  }

  // Question Panel
  const [questionsList, setQuestionsList] = useState([ createNewQuestion() ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const handleAddQuestion = (newQuestion) => {
    setQuestionsList(prev => {
      setSelectedQuestionIndex(prev.length);
      return [...prev, newQuestion];
    });
  }

  const handleDeleteQuestion = (indexToDelete) => {
    if(questionsList.length === 1) return;

    setQuestionsList(prev => {      
      const updatedQuestions = prev.filter((_, index) => index !== indexToDelete);

      if(selectedQuestionIndex === indexToDelete) {
        setSelectedQuestionIndex(indexToDelete > 0 ? indexToDelete - 1 : 0); 
      } else if(selectedQuestionIndex > indexToDelete) {
        setSelectedQuestionIndex(prev => prev - 1);
      }

      return updatedQuestions;
    })
  }

  const handleSelectQuestion = (index) => {
    setSelectedQuestionIndex(index);
  }

  // Question Editor
  const activeQuestion = selectedQuestionIndex !== null ? questionsList[selectedQuestionIndex] : null;

  const handleUpdateQuestion = (updateFields) => {
    setQuestionsList(prev => 
      prev.map((question, index) => 
        index === selectedQuestionIndex 
        ? {...question, ...updateFields}
        : question
      ));
  }

  // Student List Section
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleToggleStudent = (student) => {
    setEditQuiz(prev => {
      const exist = prev.playerIds.includes(student._id);
      
      return {
        ...prev, 
        playerIds: exist 
        ? prev.playerIds.filter(id => id !== student._id) // Remove if exist
        : [...prev.playerIds, student._id] // Add if not exist
      }
    });

    setSelectedStudents(prev => {
      const exist = prev.includes(student);

      return exist 
        ? prev.filter(id => id._id !== student._id) // Remove if exist
        : [...prev, student]; // Add if not exist
    });
  }

  // Effects
  useEffect(() => {
    if(quiz) {
      // Normalize playerIds to ensure it's an array of IDs, and extract populated student objects
      const normalizedPlayerIds = (quiz.playerIds || []).map(player =>
        typeof player === "string" ? player : player._id
      );

      // Extract populated student objects for the selectedStudents state
      const populatedStudents = (quiz.playerIds || []).filter(
        player => typeof player === "object"
      );

      setEditQuiz({
        ...quiz,
        playerIds: normalizedPlayerIds // Ensure playerIds is an array of IDs, not objects
      });

      setQuestionsList(quiz.questionIds || [createNewQuestion()]);
      setSelectedStudents(populatedStudents);
    }
  }, [quiz]);

  return (
    <DashboardLayout>
      <DashboardContent>
        <AppBreadcrumb />

        <Separator />

        <CreateHeader onBack="/dashboard_teacher/quizzes" label="cuestionarios" title="Editar cuestionario" />

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
              <Spinner />
          </div>
        ) : (
          <QuizForm 
            difficulties={difficulties} 
            quiz={editQuiz} 
            questionsList={questionsList}
            selectedQuestionIndex={selectedQuestionIndex} 
            activeQuestion={activeQuestion} 
            selectedStudents={selectedStudents}
            viewMode="edit"
            onUpdate={handleUpdate}  
            onSelectQuestion={handleSelectQuestion} 
            onAddQuestion={handleAddQuestion} 
            onDeleteQuestion={handleDeleteQuestion} 
            onUpdateQuestion={handleUpdateQuestion}
            onToggleStudent={handleToggleStudent}
            onEdit={handleEditQuiz}
          />
        )}
        
      </DashboardContent>
    </DashboardLayout>
  );
};  

export default QuizEdit;