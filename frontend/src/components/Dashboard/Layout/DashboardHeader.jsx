import { headerConfig } from "../config/header.config";
import HeaderSearch from "./Header/HeaderSearch";
import HeaderActions from "./Header/HeaderActions";
import Logo from "@/components/Common/Logo";
import { useAuth } from "@/auth/AuthContext";

const DashboardHeader = () => {
    const { user } = useAuth();

    if(!user) return null;

    const config = headerConfig[user.role];

    return(
        <header className="
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
            <div className="flex-1 md:flex justify-center hidden px-4">
                <div className="w-full max-w-md">
                    <HeaderSearch 
                        placeholder={config?.searchPlaceholder}
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