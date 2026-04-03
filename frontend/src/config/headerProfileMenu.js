export const headerProfileMenuConfig = [
  {
    labelKey: "common.profile",
    icon: "profile",
    path: (user) => `dashboard_${user.role}/profile`
  },
  {
    labelKey: "common.settings",
    icon: "settings",
    path: (user) => `dashboard_${user.role}/settings`
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