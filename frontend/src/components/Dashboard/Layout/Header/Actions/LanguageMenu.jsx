import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { languages } from "@/utils/constants";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const LanguageMenu = () => {
    const currentLangCode = i18n.language;
    const defaultLang = languages.find(lang => lang.code === currentLangCode) || languages[0];

    const { t } = useTranslation();

    const [currentLanguage, setCurrentLanguage] = useState(defaultLang);

    const handleLanguageChange = (lang) => {
        setCurrentLanguage(lang);
        i18n.changeLanguage(lang.code);
        localStorage.setItem("lang", lang.code);
    };

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
                        onClick={() => handleLanguageChange(lang)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <span className="text-lg">{lang.flag}</span> 
                        <span>{t(lang.labelKey)}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageMenu;