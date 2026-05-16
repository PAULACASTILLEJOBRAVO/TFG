
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
  // Exact match first
  if (breadcrumbConfig[pathname]) {
    return {
      items: breadcrumbConfig[pathname],
      params: {}
    };
  }

  // Dinamic routes
  for(const [route, items] of Object.entries(breadcrumbConfig)) {
    if (!route.includes(":")) continue;

    const paramNames = [];

    const regex = new RegExp(
      "^" + route.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      }) + "$"
    );

    const match = pathname.match(regex);

    if (match) {
      const values = match.slice(1);

      const params = Object.fromEntries(
        paramNames.map((name, index) => [name, values[index]])
      )

      return { items, params };
    }
  }

  return null;
};

export default function AppBreadcrumb() {
  const { pathname } = useLocation();
  const match = matchRoute(pathname);

  if (!match) return null;

  const { items, params } = match;

  const replaceParams = (path) => {
    let finalPath = path;

    Object.entries(params).forEach(([key, value]) => {
      finalPath = finalPath.replace(`:${key}`, value);
    });

    return finalPath;
  };

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.href || item.label}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink href={replaceParams(item.href)}>
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
