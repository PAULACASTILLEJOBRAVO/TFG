export const colorCard = {
    0: "bg-red-500",
    1: "bg-yellow-500",
    2: "bg-blue-500",
    3: "bg-green-500",
    4: "bg-pink-500",
    5: "bg-orange-500",
    6: "bg-purple-500",
    7: "bg-teal-500",
};

export const colsMap = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",  
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
  9: "md:grid-cols-9",
  10: "md:grid-cols-10",
  11: "md:grid-cols-11",
  12: "md:grid-cols-12",
};

export const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-xl"
};

export const languages = [
    { code: "es", label: "Español", flag:"🇪🇸" },
    { code: "en", label: "English", flag:"🇬🇧" },
]

import { Trophy, Plus, FileText, House, UserRoundPen, Settings, LogOut, NotebookPen, User, Calculator } from "lucide-react";

export const icons = {
    trophy: Trophy,
    plus: Plus,
    file: FileText,

    house: House,
    profile: UserRoundPen,
    settings: Settings,
    logout: LogOut,

    quiz: NotebookPen,

    user: User,
    clicker: Calculator,
}

export const typesQuestion = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True/False" },
]

export const rolesType = {
  student: "Estudiante",
  teacher: "Profesor",
  admin: "Administrador"
};

export const statusClicker = [
    { _id: "assigned", value: "assigned", label: "En uso" },
    { _id: "available", value: "available", label: "Disponible" },
    { _id: "damaged", value: "damaged", label: "Dañado" },
    { _id: "retired", value: "retired", label: "Retirado" },
];