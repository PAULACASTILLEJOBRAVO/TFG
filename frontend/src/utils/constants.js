export const bgColorCard = {
  0: { normal: "bg-red-500", dim: "bg-red-500/60" },
  1: { normal: "bg-yellow-500", dim: "bg-yellow-500/60" },
  2: { normal: "bg-blue-500", dim: "bg-blue-500/60" },
  3: { normal: "bg-green-500", dim: "bg-green-500/60" },
  4: { normal: "bg-pink-500", dim: "bg-pink-500/60" },
  5: { normal: "bg-orange-500", dim: "bg-orange-500/60" },
  6: { normal: "bg-purple-500", dim: "bg-purple-500/60" },
  7: { normal: "bg-teal-500", dim: "bg-teal-500/60" },
};

export const barColorCard = {
    0: { normal: "bg-red-300", dim: "bg-red-700/70" },
    1: { normal: "bg-yellow-300", dim: "bg-yellow-700/70" },
    2: { normal: "bg-blue-300", dim: "bg-blue-700/70" },
    3: { normal: "bg-green-300", dim: "bg-green-700/70" },
    4: { normal: "bg-pink-300", dim: "bg-pink-700/70" },
    5: { normal: "bg-orange-300", dim: "bg-orange-700/70" },
    6: { normal: "bg-purple-300", dim: "bg-purple-700/70" },
    7: { normal: "bg-teal-300", dim: "bg-teal-700/70" },
};

export const textColorCard = {
    0: "text-red-500",
    1: "text-yellow-500",
    2: "text-blue-500",
    3: "text-green-500",
    4: "text-pink-500",
    5: "text-orange-500",
    6: "text-purple-500",
    7: "text-teal-500"
};

export const colorChart = [
    "#4ade80", // Green
    "#f87171", // Red
    "#facc15", // Yellow
];

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
    { code: "es", labelKey: "common.spanish", flag:"🇪🇸" },
    { code: "en", labelKey: "common.english", flag:"🇬🇧" },
]

import { Trophy, Plus, FileText, House, UserRoundPen, Settings, LogOut, NotebookPen, User, Users, Calculator, MessageSquareWarning, PlayCircle, Target, Percent, GraduationCap } from "lucide-react";

export const icons = {
    trophy: Trophy,
    plus: Plus,
    file: FileText,

    house: House,
    profile: UserRoundPen,
    settings: Settings,
    tutorial: GraduationCap,
    logout: LogOut,

    quiz: NotebookPen,

    user: User,
    clicker: Calculator,
    warning: MessageSquareWarning,
    play: PlayCircle,

    participants: Users,
    accuracy: Target,
    averageTime: Percent,
    sessions: PlayCircle,
}

export const typesQuestion = [
    { value: "multiple-choice", labelKey: "teacher.quizzesManagement.quizForm.settings.multipleChoice" },
    { value: "true-false", labelKey: "teacher.quizzesManagement.quizForm.settings.trueFalse" },
]

export const rolesType = {
    student: "admin.usersManagement.table.roles.student",
    teacher: "admin.usersManagement.table.roles.teacher",
    admin: "admin.usersManagement.table.roles.admin"
};

export const statusClicker = [
    { _id: "assigned", value: "assigned", labelKey: "admin.clickersManagement.row.edit.assigned" },
    { _id: "available", value: "available", labelKey: "admin.clickersManagement.row.edit.available" },
    { _id: "damaged", value: "damaged", labelKey: "admin.clickersManagement.row.edit.damaged" },
    { _id: "retired", value: "retired", labelKey: "admin.clickersManagement.row.edit.retired" },
];

export const roleMap = {
    admin: ["admin", "administrador", "administradora"],
    student: ["student", "estudiante", "alumno", "alumna"],
    teacher: ["teacher", "profesor", "profesora", "docente", "maestro", "maestra"],
};

export const difficultyMap = {
    easy: ["easy", "fácil", "facil"],
    medium: ["medium", "medio", "intermedio"],
    hard: ["hard", "difícil", "dificil"],
};

export const statusMap = {
    published: ["published", "publicado", "publicada"],
    draft: ["draft", "borrador"],
    archive: ["archive", "archivado", "archivada"],
    deleted: ["deleted", "eliminado", "eliminada"],
    assigned: ["assigned", "asignado", "asignada", "ocupado", "ocupada", "en uso"],
    available: ["available", "disponible", "disponible"],
    damaged: ["damaged", "dañado", "dañada", "averiado", "averiada", "estropeado", "estropeada", "broken", "roto", "rota"],
    retired: ["retired", "retirado", "retirada"],
};

export const searchDictionary = {
    // STATUS
    published: ["published", "publicado", "publicada"],
    draft: ["draft", "borrador"],
    archive: ["archive", "archivado", "archivada"],
    deleted: ["deleted", "eliminado", "eliminada"],
    assigned: ["assigned", "asignado", "asignada", "ocupado", "ocupada", "en uso"],
    available: ["available", "disponible", "disponible"],
    damaged: ["damaged", "dañado", "dañada", "broken", "averiado", "averiada", "estropeado", "estropeada", "roto", "rota"],
    retired: ["retired", "retirado", "retirada"],

    // DIFFICULTY
    easy: ["easy", "fácil", "facil"],
    medium: ["medium", "medio", "intermedio"],
    hard: ["hard", "difícil", "dificil"],

    // ROLES
    admin: ["admin", "administrador", "administradora"],
    student: ["student", "estudiante", "alumno", "alumna"],
    teacher: ["teacher", "profesor", "profesora", "docente", "maestro", "maestra"],
};

export const TOLERANCE = 2;
