import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { 
    Zap,
    CircleStar,
    Trophy,
    Medal,
    Hash
 } from "lucide-react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";
import { useMemo } from "react";
import { PieGraphic } from "@/components/Common/Charts";
import { DownloadPDF } from "../../Buttons";

const SessionDetailsAccordion = ({ sessions = [], quiz = [] }) => {
    const { t } = useTranslation();

    const { averageTime, bestTime } = useMemo(() => {
        const validSessions = sessions.filter(s => s.totalTime);

        const totalTime = validSessions.reduce((acc, s) => acc + s.totalTime, 0);

        return {
            averageTime: validSessions.length > 0 
                ? totalTime / validSessions.length 
                : 0,
            bestTime: validSessions.length > 0 
                ? Math.min(...validSessions.map(s => s.totalTime))
                : 0
        };
    }, [sessions]);

    return (
        <Accordion type="multiple" className="w-full border rounded-lg">
            {sessions.map((session) => {
                const hasTime = !!session.totalTime;
                
                const totalSeconds = session.totalTime || 0;

                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                const formattedTime = hours > 0
                    ? `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
                    : `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;

                const isFast = hasTime && session.totalTime <= averageTime;

                const isBest = bestTime && session.totalTime === bestTime;

                const data = [
                    { name: t("common.sessionHistory.correctAnswers"), value: session.results?.correctAnswers || 0 },
                    { name: t("common.sessionHistory.incorrectAnswers"), value: session.results?.wrongAnswers || 0 },
                    { name: t("common.sessionHistory.unansweredQuestions"), value: session.results?.unansweredQuestions || 0 },
                ];

                const filteredData = data.filter(item => item.value > 0);

                const hasData = filteredData.length > 0;

                return (
                    <AccordionItem key={session._id} value={session._id} className="border-b px-4 last:border-b-0">
                        <AccordionTrigger className="flex items-center w-full px-4 py-2 text-base font-medium">
                                {/* Date */}
                                <span>{new Date(session.startTime).toLocaleDateString()}</span>

                                {/* Rank */}
                                <div className="flex items-center ">
                                    {session.results?.rank === 1 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Trophy className="w-4 h-4 shrink-0 mr-1 text-yellow-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.firstPlace")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : session.results?.rank === 2 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Medal className="w-4 h-4 shrink-0 mr-1 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.secondPlace")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : session.results?.rank === 3 ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Medal className="w-4 h-4 shrink-0 mr-1 text-amber-700" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.thirdPlace")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Hash className="w-4 h-4 shrink-0 mr-1 text-gray-300" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.otherPlace")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}

                                    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                                        session.results?.rank === 1
                                        ? "bg-yellow-100 text-yellow-800"
                                        : session.results?.rank === 2
                                        ? "bg-gray-100 text-gray-700"
                                        : session.results?.rank === 3
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-gray-100 text-gray-500"
                                    }`}>
                                        {session.results?.rank || "-"}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span>{hasTime ? formattedTime : "-"}</span>

                                    {isBest && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircleStar className="w-5 h-5 text-amber-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.bestSession")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {isFast && !isBest && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Zap className="w-4 h-4 text-amber-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("common.sessionHistory.fastSession")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                {/* Session Details */}
                                <div className="text-sm text-gray-600 space-y-2 flex-1">
                                    <div>
                                        <strong>{t("common.sessionHistory.startTime")}</strong>{" "}
                                        {new Date(session.startTime).toLocaleString()}
                                    </div>

                                    <div>
                                        <strong>{t("common.sessionHistory.endTime")}</strong>{" "}
                                        {session.endTime
                                            ? new Date(session.endTime).toLocaleString()
                                            : "-"}
                                    </div>

                                    <div>
                                        <strong>{t("common.sessionHistory.totalTime")}</strong>{" "}
                                        {hasTime ? `${totalSeconds}s` : "-"}
                                    </div>

                                    <div>
                                        <strong>{t("common.sessionHistory.totalScore")}</strong>{" "}
                                        {session.results?.totalScore || "-"}
                                    </div>
                                </div>

                                {/* Results Pie Chart */}
                                <div className="w-[370px] h-[270px] min-w-[300px] min-h-[250px] flex-shrink-0">
                                    {hasData ? (
                                        <PieGraphic
                                            data={filteredData}
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-sm">
                                            {t("common.sessionHistory.noData")}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* PDF Review Button */}
                            <DownloadPDF session={session} quiz={quiz} />
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};

export default SessionDetailsAccordion;