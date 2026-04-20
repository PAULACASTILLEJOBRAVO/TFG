export const headerProfileMenuConfig = [
  {
    labelKey: "common.profile",
    icon: "profile",
    path: (user) => `/dashboard_${user.role}/profile`
  },
  {
    separator: true
  },
  {
    labelKey: "common.logout",
    icon: "logout",
    action: "logout",
    danger: true
  }
];