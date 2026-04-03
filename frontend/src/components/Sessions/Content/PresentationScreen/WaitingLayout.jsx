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

            <h1 className="text-3xl font-bold mb-1">{t("teacher.sessionPresentation.waiting.title")}</h1>

            
            <p className="text-gray-500 text-lg">{t("teacher.sessionPresentation.waiting.subtitle")}</p>
            
            
            <div className="bg-white shadow-lg rounded-2xl p-6 text-left max-w-md w-full border border-gray-100">
                <ul className="space-y-3">
                    {instructions.map((instruction, index) => (
                        <li key={index}>
                            <p className="font-semibold text-gray-800">
                                {instruction.text}
                            </p>

                            {instruction.subItems && (
                                <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                                    {instruction.subItems.map((sub, i) => (
                                        <li className="flex gap-2">
                                            <span className="text-gray-400">–</span>
                                            <span>{sub}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center text-blue-500">
                <Loader2 className="animate-spin w-6 h-6" />
                <span className="text-lg font-medium animate-pulse">
                    {t("teacher.sessionPresentation.waiting.message")} 
                </span>
            </div>
        </div>
    );
};

export default WaitingLayout;