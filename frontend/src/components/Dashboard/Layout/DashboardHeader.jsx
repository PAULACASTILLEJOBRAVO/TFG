import { headerConfig } from "@/config/header.config";
import { 
    HeaderSearch, 
    HeaderActions 
} from "./Header/";
import { Logo } from "@/components/Common";
import { useTranslation } from "react-i18next";

const DashboardHeader = () => {
    const { t } = useTranslation();

    return(
        <header className="
            sticky 
            top-0 
            z-40
            h-16 
            border-b 
            bg-background 
            px-6 
            flex items-center 
            gap-2
        ">

            {/** Logo */}
            <div className="shrink-0">
                <Logo />
            </div>

            {/** Search */}
            <div className="flex-1 flex justify-center px-4">
                <div className="w-full max-w-md">
                    <HeaderSearch 
                        placeholder={t("common.search")}
                    />
                </div>
            </div>

            {/** Actions */}
            <div className="shrink-0">
                <HeaderActions />
            </div>

        </header>
    );
}

export default DashboardHeader;