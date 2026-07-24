import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Receipt,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: Receipt },
  { to: "/admin/users", label: "Users", icon: Users },
];

const AdminLayout = () => {
  return (
    <div className="container flex flex-col gap-8 py-10 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <div className="mb-4 flex items-center gap-2 px-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">Admin Panel</span>
        </div>
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
