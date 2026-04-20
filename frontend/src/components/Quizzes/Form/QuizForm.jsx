
import {
  QuizCreateHeader, 
  QuizCreateEditorLayout
} from "@/components/Quizzes/Layout/";
import {
  QuestionListPanel, 
  QuestionEditorPanel, 
  QuestionSettingsPanel
} from "@/components/Quizzes/Sections/";

import { Card } from "@/components/ui/card";
import { 
  QuizzCreateFooter, 
  QuizSearchStudents 
} from "@/components/Quizzes/Layout/";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const QuizForm = ({ difficulties, quiz, selectedStudents, questionsList, selectedQuestionIndex, quizError, questionError, questionErrors, touched, submitted, onUpdate, onSelectQuestion, onAddQuestion, onDeleteQuestion, activeQuestion, onUpdateQuestion, onToggleStudent, onSaveDraft, onPublish, onEdit, onBlur }) => {          
  const { t } = useTranslation();

  return (
    <Card>
      <QuizCreateHeader newQuiz={quiz} quizError={quizError} touched={touched} submitted={submitted} difficulties={difficulties} onChange={onUpdate} onBlur={onBlur} />

      <Separator />
      
      {/** Tabs */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="w-full flex">
          <TabsTrigger value="questions" className="flex-1">{t("teacher.quizzesManagement.quizForm.questions")}</TabsTrigger>
          <TabsTrigger value="students" className="flex-1">{t("teacher.quizzesManagement.quizForm.students")}</TabsTrigger>
        </TabsList>
        {/** TAB 1 - Questions */}
        <TabsContent value="questions">
          <QuizCreateEditorLayout>
            <QuestionListPanel 
              displayQuestions={questionsList} 
              selectedQuestion={selectedQuestionIndex} 
              questionErrors={questionErrors}
              onSelect={onSelectQuestion} 
              onAdd={onAddQuestion} 
              onDelete={onDeleteQuestion}
            />
            <QuestionEditorPanel 
              question={activeQuestion} 
              onChange={onUpdateQuestion}
              questionError={questionError}
              touched={touched?.question[selectedQuestionIndex]}
              submitted={submitted}
              onBlur={onBlur}
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