import { headerConfig } from "../config/header.config";
import HeaderSearch from "./Header/HeaderSearch";
import HeaderActions from "./Header/HeaderActions";
import Logo from "@/components/Common/Logo";

const DashboardHeader = ({ userRole }) => {
    const config = headerConfig[userRole];

    return(
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between">

            {/** Logo */}
            <Logo size="10"/>

            {/** Search */}
            <div className="flex-1 max-w-md">
                <HeaderSearch 
                    placeholder={config?.searchPlaceholder}
                />
            </div>

            {/** Actions */}
            <HeaderActions userRole={userRole} />

        </header>
    );
}

export default DashboardHeader;