import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
    { code: "es", label: "Español", flag:"🇪🇸" },
    { code: "en", label: "English", flag:"🇬🇧" },
]

const LanguageMenu = () => {
    const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <span className="text-lg">{currentLanguage.flag}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-15" >
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <span className="text-lg">{lang.flag}</span> 
                        <span>{lang.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageMenu;