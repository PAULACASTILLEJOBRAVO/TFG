import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ButtonActions = ({questionActive, showResult, onEndQuestion, onNextQuestion, onShowResults}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Button 
                variant="destructive" 
                disabled={!questionActive}
                onClick={onEndQuestion}
            >
                {t('teacher.sessionControl.questionControlScreen.endQuestion')}
            </Button>

            <Button 
                variant="outline" 
                className="md:ml-auto bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                disabled={questionActive || showResult}
                onClick={onShowResults}
            >
                {t('teacher.sessionControl.questionControlScreen.showResults')}
            </Button>

            <Button 
                className="md:ml-auto bg-green-500 hover:bg-green-600 text-white hover:text-white"
                disabled={questionActive || !showResult}
                onClick={onNextQuestion}
            >
                {t('teacher.sessionControl.questionControlScreen.nextQuestion')}
            </Button>
        </div>
    );
}

export default ButtonActions;