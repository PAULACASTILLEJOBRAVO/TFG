export const sidebarConfig = {
    share: [],
    student: [
        {
            labelKey: "common.home",
            icon: "house",
            href: "/dashboard_student/"
        },
        {
            labelKey: "student.ranking",
            icon: "trophy",
            href: "/dashboard_student/ranking"
        },
        // {
        //     labelKey: "student.stadistics",
        //     icon: "chart-bar",
        //     href: "/dashboard_student/stadistics"
        // },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_student/profile"
        },
        {
            labelKey: "common.settings",
            icon: "settings",
            href: "/dashboard_student/settings"
        },
        // {
        //     labelKey: "common.tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_student/tutorial"
        // },
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
        // {
        //     labelKey: "teacher.historical",
        //     icon: "clock",
        //     href: "/dashboard_teacher/historic"
        // },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_teacher/profile"
        },
        {
            labelKey: "common.settings",
            icon: "settings",
            href: "/dashboard_teacher/settings"
        },
        // {
        //     labelKey: "common.tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_teacher/tutorial"
        // },
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
        // {
        //     labelKey: "admin.stadistics",
        //     icon: "chart-bar",
        //     href: "/dashboard_admin/stadistics"
        // },
        {
            labelKey: "common.profile",
            icon: "profile",
            href: "/dashboard_admin/profile"
        },
        {
            labelKey: "common.settings",
            icon: "settings",
            href: "/dashboard_admin/settings"
        },
        // {
        //     labelKey: "common.tutorial",
        //     icon: "tutorial",
        //     href: "/dashboard_admin/tutorial"
        // },
        {
            labelKey: "common.logout",
            icon: "logout",
            action: "logout"
        }
    ]
}