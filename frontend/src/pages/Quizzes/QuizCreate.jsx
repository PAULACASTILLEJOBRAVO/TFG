import { 
  DashboardLayout, 
  DashboardContent 
} from "@/components/Dashboard/Layout";
import { 
  AppBreadcrumb, 
  CreateHeader 
} from "@/components/Common";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import { createNewQuestion } from "@/utils/questions";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { useNavigate } from "react-router-dom";
import { QuizForm } from "@/components/Quizzes/Form";
import { 
  validateQuiz,
  validateQuestion
} from "@/utils/validators";
import { useTranslation } from "react-i18next";

const QuizCreate = () => {
  const { user } = useAuth();
  const { difficulties } = useDifficulties();
  const { create } = useQuizActions();

  // Data
  const [createQuiz, setCreateQuiz] = useState({ title: "", description: "", creatorId: user ? user._id : null, playerIds: [], difficulty: "easy", isActive: false, status: "draft" });

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ 
    quiz: {title: false}, 
    question: [
      { text: false, options: [false, false, false, false], isCorrect: false },
    ]
  });

  const quizError = validateQuiz(createQuiz);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleUpdate = (field, value) => {
    setCreateQuiz(prev => ({...prev, [field]: value}));
  }

  const handlePublish = async () => {
    setCreateQuiz(prev => ({...prev, isActive: true, status: "published"}));

    setSubmitted(true);

    if(quizError || questionError.some(error => error)) return;

    try {
      await create({quizFields: createQuiz, questions: questionsList});
      navigate("/dashboard_teacher/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  const handleSaveDraft = async () => {
    setCreateQuiz(prev => ({...prev, isActive: false, status: "draft"}));

    setSubmitted(true);
    
    if(quizError || questionError.some(error => error)) return;

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

  const questionError = questionsList.length > 0 ? questionsList.map(question => validateQuestion(question)) : [];

  const handleAddQuestion = (newQuestion) => {
    setQuestionsList(prev => {
      setSelectedQuestionIndex(prev.length);

      return [...prev, newQuestion];
    });

    setTouched(prev => ({ 
      ...prev, 
      question: [
        ...prev.question, 
        { text: false, options: [false, false, false, false], isCorrect: false }
      ] 
    }));
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
      
      setTouched(prev => {
        const updatedQuestionsTouched = prev.question.filter((_, index) => index !== indexToDelete);

        return {...prev, question: updatedQuestionsTouched};
      });

      return updatedQuestions;
    });
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

  // Validation
  const handleBlur = (section, field, optionIndex = null) => {
    setTouched(prev => {
      // For question fields (text, options, isCorrect)
      if (section === "question") {
        // If it's an option field, we need to specify which option is being updated
        const updatedQuestions = [...prev.question];
        // Get the current touched state for the selected question
        const currentQuestionTouched = { ...updatedQuestions[selectedQuestionIndex] };

        // If it's an option field, update the touched state for that specific option
        if (field === "options" && optionIndex !== null) {
          const newOptions = [...currentQuestionTouched.options];
          newOptions[optionIndex] = true;
          currentQuestionTouched.options = newOptions;
        } else { // For text or isCorrect fields, update the touched state for that field
          currentQuestionTouched[field] = true;
        }

        updatedQuestions[selectedQuestionIndex] = currentQuestionTouched;

        return {
          ...prev,
          question: updatedQuestions
        };
      }

      // For quiz (title)
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: true
        }
      };
    });
  };

  return (
    <DashboardLayout>
      <DashboardContent>
        <AppBreadcrumb />

        <Separator />

        <CreateHeader onBack="/dashboard_teacher/quizzes" label={t('common.quizzesManagement.labelButton')} title={t('teacher.quizzesManagement.quizForm.create.title')} />

        <QuizForm 
          difficulties={difficulties} 
          quiz={createQuiz} 
          questionsList={questionsList}
          selectedQuestionIndex={selectedQuestionIndex} 
          activeQuestion={activeQuestion} 
          selectedStudents={selectedStudents}
          quizError={quizError}
          questionError={questionError[selectedQuestionIndex]}
          touched={touched}
          submitted={submitted}
          onUpdate={handleUpdate}  
          onSelectQuestion={handleSelectQuestion} 
          onAddQuestion={handleAddQuestion} 
          onDeleteQuestion={handleDeleteQuestion} 
          onUpdateQuestion={handleUpdateQuestion}
          onToggleStudent={handleToggleStudent}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          onBlur={handleBlur}
        />
        
      </DashboardContent>
    </DashboardLayout>
  );
};  

export default QuizCreate;