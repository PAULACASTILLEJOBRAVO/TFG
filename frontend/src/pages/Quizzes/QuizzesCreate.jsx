import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/Layout/DashboardContent";
import AppBreadcrumb from "@/components/Common/AppBreadcrumb";
import { Separator } from "@/components/ui/separator";
import CreateHeader from "@/components/Common/CreateHeader";
import QuizCreateHeader from "@/components/Quizzes/Layout/QuizCreateHeader";
import { useState } from "react";
import QuizCreateEditorLayout from "@/components/Quizzes/Layout/QuizCreateEditorLayout";
import QuestionListPanel from "@/components/Quizzes/Sections/QuestionListPanel";
import QuestionEditorPanel from "@/components/Quizzes/Sections/QuestionEditorPanel";
import QuestionSettingsPanel from "@/components/Quizzes/Sections/QuestionSettingsPanel";
import { Card } from "@/components/ui/card";
import QuizzCreateFooter from "@/components/Quizzes/Layout/QuizzCreateFooter";
import { useAuth } from "@/auth/AuthContext";

const QuizCreate = () => {
  const { user } = useAuth();

  // Data
  const [createQuiz, setCreateQuiz] = useState({ title: "", description: "", creatorId: user ? user._id : null, dificulty: "", isPublic: "", isActive: false });

  const handleUpdate = (field, value) => {
    setCreateQuiz(prev => ({...prev, [field]: value}));
    console.log("Updated quiz data:", createQuiz);
  }

  const handlePublish = () => {
    setCreateQuiz(prev => ({...prev, isActive: true}));
  }

  const handleSaveDraft = () => {
    setCreateQuiz(prev => ({...prev, isActive: false}));
  }

  // Question Panel
  const [questionsList, setQuestionsList] = useState([{ text: "", type: "multiple-choice", options: [] }]);
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

  return (
    <DashboardLayout>
      <DashboardContent>
        <AppBreadcrumb />

        <Separator />

        <CreateHeader onBack="/dashboard_teacher/quizzes" label="cuestionarios" title="Crear nuevo cuestionario" />

        <Card>
          <QuizCreateHeader newQuiz={createQuiz} onChange={handleUpdate} />

          <Separator />

          <QuizCreateEditorLayout>
            <QuestionListPanel 
              displayQuestions={questionsList} 
              selectedQuestion={selectedQuestionIndex} 
              onSelect={handleSelectQuestion} 
              onAdd={handleAddQuestion} 
              onDelete={handleDeleteQuestion}/>
            <QuestionEditorPanel />
            <QuestionSettingsPanel />
          </QuizCreateEditorLayout>

          
          <QuizzCreateFooter onPublish={handlePublish} onDraft={handleSaveDraft} />
         
        </Card>
      </DashboardContent>
    </DashboardLayout>
  );
};  

export default QuizCreate;