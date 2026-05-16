export const breadcrumbConfig = {
    "/dashboard_admin/users": [
        { label: "Users" }
    ],
    "/dashboard_admin/users/create": [
        { label: "Users", href: "/dashboard_admin/users" },
        { label: "Create User", }
    ],
    "/dashboard_admin/profile": [
        { label: "Profile" }
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
        { label: "Session" }
    ],
    "/dashboard_teacher/quizzes/:id/sessions": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Quiz Sessions" }
    ],
    "/dashboard_teacher/quizzes/:id/students/:studentId/history": [
        { label: "Quizzes", href: "/dashboard_teacher/quizzes" },
        { label: "Quiz Sessions", href: "/dashboard_teacher/quizzes/:id/sessions" },
        { label: "Session Details" }
    ],
    "/dashboard_teacher/profile": [
        { label: "Profile" }
    ],

    "/dashboard_student/quizzes/:id/history": [
        { label: "Quizzes", href: "/dashboard_student/quizzes" },
        { label: "Quiz History" }
    ],
    "/dashboard_student/profile": [
        { label: "Profile" }
    ]
}   