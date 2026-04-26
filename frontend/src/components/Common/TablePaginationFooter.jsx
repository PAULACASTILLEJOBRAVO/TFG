import { icons } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue, 
    SelectGroup 
} from "@/components/ui/select";
import { Button } from "../ui/button";

const TablePaginationFooter = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
    const { t } = useTranslation();

    const getPageItems = () => {
        const items = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        items.push(1);

        if (start > 2) {
            items.push("start-ellipsis");
        }

        for (let i = start; i <= end; i++) {
            items.push(i);
        }

        if (end < totalPages - 1) {
            items.push("end-ellipsis");
        }

        items.push(totalPages);

        return items;
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">

            <div className="flex items-center gap-2">
                <span className="text-sm">{t("common.rowsPerPage")}</span>
            
            <Select 
                value={String(rowsPerPage)} 
                onValueChange={(value) => {
                    onRowsPerPageChange(Number(value));
                    onPageChange(1); // reset 
                }}
            >
                <SelectTrigger className="w-100">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {[5, 10, 20, 30, 40, 50, 100].map(size => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    <icons.leftArrowPage className="h-4 w-4" />
                </Button>

                {getPageItems().map((item, index) => {
                    if (typeof item === "string") {
                        return (
                            <span key={index} className="px-2 text-muted-foreground">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            variant={item === currentPage ? "solid" : "outline"}
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={`px-3 py-1 border rounded ${
                                item === currentPage ? "bg-primary text-white" : ""
                            }`}
                        >
                            {item}
                        </Button>
                    );
                })}
                
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    <icons.rightArrowPage className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default TablePaginationFooter;