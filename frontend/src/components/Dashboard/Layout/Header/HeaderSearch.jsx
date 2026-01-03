import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const HeaderSearch = ({ placeholder = "Buscar..." }) => {
    return (
        <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400"/>
            <Input
                placeholder={placeholder}
                className="pl-9 w-full"
            />
        </div>
    )
}

export default HeaderSearch;