import { 
    Command, 
    CommandEmpty, 
    CommandInput, 
    CommandList, 
    CommandItem 
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { useStudents } from "@/hooks/Users/useStudents";

const StudentSearch = ({ placeholder = "Buscar...", selectedIdStudents = [], onSelect }) => {
    const { students, loading } = useStudents();

    if (loading) return <div className="flex justify-center"><Spinner className="h-10 w-10" color="blue" /></div>;

    return (
        <div className="relative flex items-center">
            <Command className="w-full rounded-lg border">
                <CommandInput placeholder={placeholder} className="pl-9 w-full" />
                <CommandEmpty>No se encontraron estudiantes.</CommandEmpty>
                <CommandList className="max-h-60 overflow-y-auto">
                    {students.map(student => {
                        const isSelected = selectedIdStudents.includes(student._id);

                        return(
                            <CommandItem key={student._id} onSelect={() => onSelect(student)} className={`flex cursor-pointer items-center ${isSelected ? 'opacity-60' : ''}`}>
                                {isSelected && <span className="text-green-500">✓</span>}
                                {student.fullname ? student.fullname : student.username}
                            </CommandItem>
                        )
                    })}
                </CommandList>

            </Command>
        </div>
    )
}

export default StudentSearch;