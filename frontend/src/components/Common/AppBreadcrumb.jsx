
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { breadcrumbConfig } from "@/config/breadcrumb.config";
import { Fragment } from "react";

const matchRoute = (pathname) => {
  if (breadcrumbConfig[pathname]) return breadcrumbConfig[pathname];

  // Soporte básico para rutas dinámicas (/users/:id)
  return Object.entries(breadcrumbConfig).find(([route]) => {
    if (!route.includes(":")) return false;

    const baseRoute = route.split("/:")[0];
    return pathname.startsWith(baseRoute);
  })?.[1];
};

export default function AppBreadcrumb() {
  const { pathname } = useLocation();
  const items = matchRoute(pathname);

  if (!items) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.href || item.label}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}

              </BreadcrumbItem>
                
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
