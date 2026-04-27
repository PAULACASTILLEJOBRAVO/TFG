import { 
  DashboardLayout, 
  DashboardContent 
} from "@/components/Dashboard/Layout";
import { 
  AppBreadcrumb, 
  CreateHeader 
} from "@/components/Common";
import { Separator } from "@/components/ui/separator";
import { 
  useEffect, 
  useState 
} from "react";
import { useDifficulties } from "@/hooks/Difficulties/useDifficulties";
import { createNewQuestion } from "@/utils/questions";
import { useQuizActions } from "@/hooks/Quizzes/useQuizActions";
import { useNavigate } from "react-router-dom";
import { QuizForm } from "@/components/Quizzes/Form";
import { useParams } from "react-router-dom";
import { useQuizForTeacher } from "@/hooks/Quizzes/useQuizForTeacher";
import { Spinner } from "@/components/ui/spinner";
import { 
  validateQuiz, 
  validateQuestion 
} from "@/utils/validators";
import { useTranslation } from "react-i18next";

const QuizEdit = () => {
  const { id } = useParams();
  const { quizForTeacher, loading } = useQuizForTeacher(id);

  const { difficulties } = useDifficulties();
  const { update } = useQuizActions();

  // Data
  const [editQuiz, setEditQuiz] = useState({ ...quizForTeacher });

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ 
    quiz: {title: false}, 
    question: [
      { text: false, options: [], isCorrect: false },
    ]
  });

  const quizError = validateQuiz(editQuiz);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleUpdate = (field, value) => {
    setEditQuiz(prev => ({...prev, [field]: value}));
  }

  const handleEditQuiz = async () => {
    setSubmitted(true);
    if(quizError || questionErrors.some(error => error)) return;

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

  const questionErrors = questionsList.length > 0 ? questionsList.map(question => validateQuestion(question)) : [];

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
      )
    );
    if(updateFields.options) {
      setTouched(prev => {
        const updatedQuestions = [...prev.question];
        const currentQuestionTouched = { ...updatedQuestions[selectedQuestionIndex] };

        const newLength = updateFields.options.length;
        let newOptionsTouched = currentQuestionTouched.options || [];

        while(newOptionsTouched.length < newLength) newOptionsTouched.push(false);

        while(newOptionsTouched.length > newLength) newOptionsTouched.pop();

        currentQuestionTouched.options = newOptionsTouched;
        updatedQuestions[selectedQuestionIndex] = currentQuestionTouched;

        return {
          ...prev,
          question: updatedQuestions
        };

      });
    }
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

  // Effects
  useEffect(() => {
    if(quizForTeacher) {
      // Normalize playerIds to ensure it's an array of IDs, and extract populated student objects
      const normalizedPlayerIds = (quizForTeacher.playerIds || []).map(player =>
        typeof player === "string" ? player : player._id
      );

      // Extract populated student objects for the selectedStudents state
      const populatedStudents = (quizForTeacher.playerIds || []).filter(
        player => typeof player === "object"
      );

      setEditQuiz({
        ...quizForTeacher,
        playerIds: normalizedPlayerIds // Ensure playerIds is an array of IDs, not objects
      });

      const loadedQuestions = quizForTeacher.questionIds || [createNewQuestion()];

      setQuestionsList(loadedQuestions);

      // Initialize touched state for questions based on the loaded quiz questions (and their options)
      const initialTouched = loadedQuestions.map(question => ({
        text: !!question.text,
        options: question.options.map(option => !!option.text),
        isCorrect: question.options.some(option => option.isCorrect)
      }));

      setTouched({ quiz: { title: !!quizForTeacher.title }, question: initialTouched });

      setSelectedStudents(populatedStudents);
    }
  }, [quizForTeacher]);

  return (
    <DashboardLayout>
      <DashboardContent>
        <AppBreadcrumb />

        <Separator />

        <CreateHeader onBack="/dashboard_teacher/quizzes" label={t("common.quizzesManagement.labelButton")} title={t("teacher.quizzesManagement.quizForm.edit.title")} />

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
            quizError={quizError}
            questionError={questionErrors[selectedQuestionIndex]}
            questionErrors={questionErrors}
            touched={touched}
            submitted={submitted}
            onUpdate={handleUpdate}  
            onSelectQuestion={handleSelectQuestion} 
            onAddQuestion={handleAddQuestion} 
            onDeleteQuestion={handleDeleteQuestion} 
            onUpdateQuestion={handleUpdateQuestion}
            onToggleStudent={handleToggleStudent}
            onEdit={handleEditQuiz}
            onBlur={handleBlur}
          />
        )}
        
      </DashboardContent>
    </DashboardLayout>
  );
};  

export default QuizEdit;