export const headerActionMenuConfig = {
  admin: [
    {
        labelKey: "admin.users",
        icon: "user",
        path: "/dashboard_admin/users"
    },
    {
        separator: true
    },
    {
        labelKey: "admin.clickers",
        icon: "clicker",
        path: "/dashboard_admin/clickers"
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