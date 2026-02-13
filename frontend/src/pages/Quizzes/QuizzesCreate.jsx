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
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import { createNewQuestion } from "@/utils/questions";
import QuizSearchStudents from "@/components/Quizzes/Layout/QuizSearchStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { useNavigate } from "react-router-dom";

const QuizCreate = () => {
  const { user } = useAuth();
  const { difficulties } = useDifficulties();
  const { create } = useQuizActions();

  // Data
  const [createQuiz, setCreateQuiz] = useState({ title: "", description: "", creatorId: user ? user._id : null, playerIds: [], difficulty: "easy", isActive: false });

  const navigate = useNavigate();

  const handleUpdate = (field, value) => {
    setCreateQuiz(prev => ({...prev, [field]: value}));
  }

  const handlePublish = async () => {
    setCreateQuiz(prev => ({...prev, isActive: true}));

    try {
      await create({quizFields: createQuiz, questions: questionsList});
      navigate("/dashboard_teacher/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  const handleSaveDraft = async () => {
    setCreateQuiz(prev => ({...prev, isActive: false}));

    try {
      await create({quizFields: createQuiz, questions: questionsList});
      navigate("/dashboard_teacher/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
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
    setCreateQuiz(prev => {
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

  return (
    <DashboardLayout>
      <DashboardContent>
        <AppBreadcrumb />

        <Separator />

        <CreateHeader onBack="/dashboard_teacher/quizzes" label="cuestionarios" title="Crear nuevo cuestionario" />

        <Card>
          <QuizCreateHeader newQuiz={createQuiz} difficulties={difficulties} onChange={handleUpdate} />

          <Separator />
          
          {/** Tabs */}
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="w-full flex">
              <TabsTrigger value="questions" className="flex-1">Preguntas</TabsTrigger>
              <TabsTrigger value="students" className="flex-1">Estudiantes</TabsTrigger>
            </TabsList>
            {/** TAB 1 - Questions */}
            <TabsContent value="questions">
              <QuizCreateEditorLayout>
                <QuestionListPanel 
                  displayQuestions={questionsList} 
                  selectedQuestion={selectedQuestionIndex} 
                  onSelect={handleSelectQuestion} 
                  onAdd={handleAddQuestion} 
                  onDelete={handleDeleteQuestion}
                />
                <QuestionEditorPanel 
                  question={activeQuestion} 
                  onChange={handleUpdateQuestion}
                />
                <QuestionSettingsPanel 
                  question={activeQuestion} 
                  onChange={handleUpdateQuestion} 
                />
              </QuizCreateEditorLayout>
            </TabsContent>

            <TabsContent value="students">
              <QuizSearchStudents selectedIdStudents={createQuiz.playerIds} selectedStudents={selectedStudents} onToggle={handleToggleStudent} />
            </TabsContent>
          </Tabs>
          
          <QuizzCreateFooter onPublish={handlePublish} onDraft={handleSaveDraft} />
         
        </Card>
      </DashboardContent>
    </DashboardLayout>
  );
};  

export default QuizCreate;