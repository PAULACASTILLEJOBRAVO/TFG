export const sidebarConfig = {
    share: [],
    student: [
        {
            labelKey: "common.home",
            icon: "house",
            href: "/dashboard_student/"
        },
        {
            labelKey: "teacher.quizzes",
            icon: "quiz",
            href: "/dashboard_student/quizzes"
        },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_student/profile"
        },
        {
            labelKey: "common.tutorial",
            icon: "tutorial",
            href: "/dashboard_student/tutorial"
        },
        {
            labelKey: "common.logout",
            icon: "logout",
            action: "logout"
        }
    ],
    teacher: [
        {
            labelKey: "common.home",
            icon: "house",
            href: "/dashboard_teacher/"
        },
        {
            labelKey: "teacher.quizzes",
            icon: "quiz",
            href: "/dashboard_teacher/quizzes"
        },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_teacher/profile"
        },
        {
            labelKey: "common.tutorial",
            icon: "tutorial",
            href: "/dashboard_teacher/tutorial"
        },
        {
            labelKey: "common.logout",
            icon: "logout",
            action: "logout"
        }
    ],
    admin: [
        {
            labelKey: "common.home",
            icon: "house",
            href: "/dashboard_admin/"
        },
        {
            labelKey: "admin.users",
            icon: "user",
            href: "/dashboard_admin/users"
        },
        {
            labelKey: "admin.clickers",
            icon: "clicker",
            href: "/dashboard_admin/clickers"
        },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_admin/profile"
        },
        {
            labelKey: "common.tutorial",
            icon: "tutorial",
            href: "/dashboard_admin/tutorial"
        },
        {
            labelKey: "common.logout",
            icon: "logout",
            action: "logout"
        }
    ]
}