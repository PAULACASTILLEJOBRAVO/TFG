import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
    useState, 
    useEffect 
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderSearch = ({ placeholder = "Buscar..." }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");

    // Update search term based on URL query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("search") || "";
        setSearchTerm(query);
    }, [location.search]);

    // Handle search input change
    const handleSearchChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);

        // Update URL query parameter
        const params = new URLSearchParams(location.search);

        if (newValue) {
            params.set("search", newValue);
        } else {
            params.delete("search");
        }
        navigate(`${location.pathname}?${params.toString()}`);
    }

    return (
        <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400"/>
            <Input
                placeholder={placeholder}
                className="pl-9 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    )
}

export default HeaderSearch;