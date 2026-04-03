export const classifyStatus = (status) => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 400 && status < 500) return "info";
    if (status >= 500) return "error";
    
    return "error";
};

export const roleDashboardMap = {
  student: "/dashboard_student",
  teacher: "/dashboard_teacher",
  admin: "/dashboard_admin"
};
