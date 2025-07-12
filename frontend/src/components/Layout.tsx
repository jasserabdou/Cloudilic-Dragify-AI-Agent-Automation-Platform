import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import ServerStatusMonitor from "./ServerStatusMonitor";

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/leads", label: "Leads" },
    { path: "/events", label: "Events" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-primary-400 text-high-contrast">
            Cloudilic
          </h1>
          <p className="text-sm text-gray-300">AI Agent Dashboard</p>
        </div>

        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`block p-2 rounded transition ${
                    location.pathname === item.path
                      ? "bg-gray-700 text-primary-400 text-high-contrast"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-200">
                {user?.username || "User"}
              </p>
              <p className="text-sm text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <header className="bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-100 text-high-contrast">
            {navItems.find((item) => item.path === location.pathname)?.label ||
              "Dashboard"}
          </h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>

        {/* Server status monitor */}
        <ServerStatusMonitor />
      </div>
    </div>
  );
};

export default Layout;
