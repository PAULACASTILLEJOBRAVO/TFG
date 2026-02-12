export const sidebarConfig = {
    share: [],
    student: [
        {
            label: "Inicio",
            icon: "house",
            href: "/dashboard_student/"
        },
        // {
        //     label: "Cursos",
        //     icon: "book",
        //     href: "/dashboard_student/courses"
        // },
        {
            label: "Ranking",
            icon: "trophy",
            href: "/dashboard_student/ranking"
        },
        // {
        //     label: "Estadísticas",
        //     icon: "chart-bar",
        //     href: "/dashboard_student/stadistics"
        // },
        {
            label: "Perfil",
            icon: "profile",
            href: "/dashboard_student/profile"
        },
        {
            label: "Ajustes",
            icon: "settings",
            href: "/dashboard_student/settings"
        },
        // {
        //     label: "Tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_student/tutorial"
        // },
        {
            label: "Log out",
            icon: "logout",
            action: "logout"
        }
    ],
    teacher: [
        {
            label: "Inicio",
            icon: "house",
            href: "/dashboard_teacher/"
        },
        // {
        //     label: "Cursos",
        //     icon: "book",
        //     href: "/dashboard_teacher/courses"
        // },
        {
            label: "Cuestionarios",
            icon: "quiz",
            href: "/dashboard_teacher/quizzes"
        },
        // {
        //     label: "Histórico",
        //     icon: "clock",
        //     href: "/dashboard_teacher/historic"
        // },
        {
            label: "Perfil",
            icon: "profile",
            href: "/dashboard_teacher/profile"
        },
        {
            label: "Ajustes",
            icon: "settings",
            href: "/dashboard_teacher/settings"
        },
        // {
        //     label: "Tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_teacher/tutorial"
        // },
        {
            label: "Log out",
            icon: "logout",
            action: "logout"
        }
    ],
    admin: [
        {
            label: "Inicio",
            icon: "house",
            href: "/dashboard_admin/"
        },
        {
            label: "Usuarios",
            icon: "user",
            href: "/dashboard_admin/users"
        },
        {
            label: "Clickers",
            icon: "clicker",
            href: "/dashboard_admin/clickers"
        },
        // {
        //     label: "Estadísticas",
        //     icon: "chart-bar",
        //     href: "/dashboard_admin/stadistics"
        // },
        {
            label: "Perfil",
            icon: "profile",
            href: "/dashboard_admin/profile"
        },
        {
            label: "Ajustes",
            icon: "settings",
            href: "/dashboard_admin/settings"
        },
        // {
        //     label: "Tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_admin/tutorial"
        // },
        {
            label: "Log out",
            icon: "logout",
            action: "logout"
        }
    ]
}