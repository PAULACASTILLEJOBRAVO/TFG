
import QuizCreateHeader from "@/components/Quizzes/Layout/QuizCreateHeader";
import QuizCreateEditorLayout from "@/components/Quizzes/Layout/QuizCreateEditorLayout";
import QuestionListPanel from "@/components/Quizzes/Sections/QuestionListPanel";
import QuestionEditorPanel from "@/components/Quizzes/Sections/QuestionEditorPanel";
import QuestionSettingsPanel from "@/components/Quizzes/Sections/QuestionSettingsPanel";
import { Card } from "@/components/ui/card";
import QuizzCreateFooter from "@/components/Quizzes/Layout/QuizzCreateFooter";
import QuizSearchStudents from "@/components/Quizzes/Layout/QuizSearchStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const QuizForm = ({ difficulties, quiz, selectedStudents, questionsList, selectedQuestionIndex, viewMode = "create", onUpdate, onSelectQuestion, onAddQuestion, onDeleteQuestion, activeQuestion, onUpdateQuestion, onToggleStudent, onSaveDraft, onPublish, onEdit }) => {        
  return (
    <Card>
      <QuizCreateHeader newQuiz={quiz} difficulties={difficulties} onChange={onUpdate} />

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
              onSelect={onSelectQuestion} 
              onAdd={onAddQuestion} 
              onDelete={onDeleteQuestion}
            />
            <QuestionEditorPanel 
              question={activeQuestion} 
              onChange={onUpdateQuestion}
            />
            <QuestionSettingsPanel 
              question={activeQuestion} 
              onChange={onUpdateQuestion} 
            />
          </QuizCreateEditorLayout>
        </TabsContent>

        <TabsContent value="students">
          <QuizSearchStudents selectedIdStudents={quiz.playerIds} selectedStudents={selectedStudents} onToggle={onToggleStudent} />
        </TabsContent>
      </Tabs>
      
      <QuizzCreateFooter onEdit={onEdit} onPublish={onPublish} onDraft={onSaveDraft} />
      
    </Card>
  );
}

export default QuizForm;