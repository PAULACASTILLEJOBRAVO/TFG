import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const WaitingLayout = () => {
    const { t } = useTranslation();

    const instructions = t(
        "teacher.sessionPresentation.waiting.instructions",
        { returnObjects: true }
    );

    return (
        <div className="flex flex-col items-center h-full w-full text-center pt-2 gap-4">

            <h1 className="text-3xl lg:text-6xl xl:text-8xl font-bold mb-1">{t("teacher.sessionPresentation.waiting.title")}</h1>

            <p className="text-gray-500 text-lg lg:text-xl xl:text-5xl">{t("teacher.sessionPresentation.waiting.subtitle")}</p>            
            
            {/* <div className="bg-white shadow-lg rounded-2xl p-6 text-left max-w-md w-full border border-gray-100">
                <ul className="space-y-3"> */}
            <div className="bg-white shadow-lg rounded-2xl p-6 lg:p-8 text-left
                w-[92%] sm:w-[85%] lg:w-[75%] xl:w-[65%]
                h-[92%] sm:h-[85%] lg:h-[75%] xl:h-[65%]
                max-w-md xl:max-w-5xl
                max-h-md xl:max-h-5xl
                border border-gray-100">

                <ul className="space-y-4 lg:space-y-6">
                    {instructions.map((instruction, index) => (
                        <li key={index}>
                            <p className="font-semibold text-gray-800 text-xl sm:text-xl lg:text-2xl xl:text-4xl leading-snug">
                                {instruction.text}
                            </p>

                            {instruction.subItems && (
                                <ul className="ml-4 mt-2 space-y-2 text-gray-600">
                                    {instruction.subItems.map((sub) => (
                                        <li className="flex gap-2 items-start">
                                            <span className="text-lg lg:text-xl xl:text-3xl leading-relaxed break-words">{sub}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center text-blue-500">
                <Loader2 className="animate-spin w-6 h-6  lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
                <span className="text-lg lg:text-3xl xl:text-5xl font-medium animate-pulse">
                    {t("teacher.sessionPresentation.waiting.message")} 
                </span>
            </div>
        </div>
    );
};

export default WaitingLayout;