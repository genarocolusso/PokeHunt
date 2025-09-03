import { NavLink, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export const NavBar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const hasUserLogin = user?.aud;
  const routes = [
    { path: "/", title: "Home" },
    { path: "/hunt-collection", title: "Collection", hide: !hasUserLogin },
  ];

  const routesForUser = routes.filter((route) => !route.hide);

  return (
    <nav className="flex gap-4">
      {routesForUser.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={`hover:opacity-80 font-semibold ${location.pathname == route.path ? "text-emerald-400" : ""}`}
        >
          {route.title}
        </NavLink>
      ))}
    </nav>
  );
};
