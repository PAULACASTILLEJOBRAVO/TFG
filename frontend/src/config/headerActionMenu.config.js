export const headerActionMenuConfig = {
  admin: [
    {
        labelKey: "admin.users",
        icon: "user",
        path: "/dashboard_admin/users"
    },
    {
        labelKey: "admin.clickers",
        icon: "clicker",
        path: "/dashboard_admin/clickers"
    },
    {
        labelKey: "admin.sessions",
        icon: "play",
        path: "/dashboard_admin/sessions"
    },
    {
        separator: true
    },
    {
        labelKey: "admin.reports",
        icon: "warning",
        path: "/dashboard_admin/reports"
    }
  ],
  teacher: [  
    {
        labelKey: "teacher.createQuiz",
        icon: "notebook-pen",
        path: "/dashboard_teacher/quizzes/create"
    }
  ]
};