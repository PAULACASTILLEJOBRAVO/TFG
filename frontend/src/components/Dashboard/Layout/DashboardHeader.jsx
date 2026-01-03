import { headerConfig } from "../config/header.config";
import HeaderSearch from "./Header/HeaderSearch";
import HeaderActions from "./Header/HeaderActions";

const DashboardHeader = ({ userRole }) => {
    const config = headerConfig[userRole];

    return(
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between">

            {/** Logo */}
            <div className="flex items-center gap-2 font-semibold text-lg text-red-700" >
                <img src="/LogoClicklass.png" alt="Clicklass Logo" className="h-9 w-9" />
                <span ></span>
                Clicklass
            </div>

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