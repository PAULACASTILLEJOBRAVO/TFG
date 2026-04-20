export const breadcrumbConfig = {
    "/dashboard_admin/users": [
        { label: "Users" }
    ],
    "/dashboard_admin/users/create": [
        { label: "Users", href: "/dashboard_admin/users" },
        { label: "Create User", }
    ],
    "/dashboard_teacher/quizzes": [
        { label: "Quizzes" }
    ],
    "/dashboard_teacher/quizzes/create": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Create Quiz", }
    ],
    "/dashboard_teacher/quizzes/:id/edit": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Edit Quiz", }
    ],
    "/dashboard_teacher/session/:id": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Quiz's Session" }
    ],
    "/dashboard_student/quizzes/:id/history": [
        { label: "Quizzes", href: "/dashboard_student/quizzes" },
        { label: "Quiz's History" }
    ],
    "/dashboard_teacher/quizzes/:id/sessions": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Quiz's Sessions" }
    ],
}   