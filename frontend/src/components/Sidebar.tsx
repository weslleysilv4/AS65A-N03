import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  Plus,
  Clock,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import LogoutConfirmModal from "@/components/ui/LogoutConfirmModal";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  userRole?: "ADMIN" | "PUBLISHER";
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function Sidebar({
  activeItem,
  onItemClick,
  userRole = "PUBLISHER",
  expanded = true,
  onToggleExpanded,
}: SidebarProps) {
  const { logout } = useAuthContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems =
    userRole === "ADMIN"
      ? [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "my-news", label: "Gerenciar Notícias", icon: FileText },
          { id: "create-news", label: "Nova Notícia", icon: Plus },
          { id: "admin-pending", label: "Aprovar Mudanças", icon: Shield },
          { id: "users", label: "Usuários", icon: Users },
          { id: "categories", label: "Categorias", icon: FolderOpen },
          { id: "settings", label: "Configurações", icon: Settings },
        ]
      : [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "my-news", label: "Minhas Notícias", icon: FileText },
          { id: "create-news", label: "Nova Notícia", icon: Plus },
          { id: "pending", label: "Pendentes", icon: Clock },
        ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
  };

  return (
    <div
      className={`bg-gray-50 h-screen border-r border-gray-200 transition-all duration-300 flex flex-col ${
        expanded ? "w-80" : "w-16"
      }`}
    >
      <div className={`flex-shrink-0 ${expanded ? "p-6" : "p-3"}`}>
        <div className="flex items-center justify-between mb-8">
          <div
            className={`transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {expanded && (
              <>
                <h1 className="text-lg font-medium text-gray-900">ELLP News</h1>
                <p className="text-sm text-gray-600">
                  {userRole === "ADMIN" ? "Administrador" : "Publisher"}
                </p>
              </>
            )}
          </div>
          {onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
              title={expanded ? "Recolher sidebar" : "Expandir sidebar"}
            >
              {expanded ? (
                <ChevronLeft size={20} className="text-gray-600" />
              ) : (
                <ChevronRight size={20} className="text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      <nav className={`flex-1 space-y-2 ${expanded ? "px-6" : "px-2"}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center ${
                expanded ? "gap-3 px-3" : "justify-center px-2"
              } py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={!expanded ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {expanded && (
                <span className="transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-gray-200 ${expanded ? "p-6" : "p-3"}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            expanded ? "gap-3 px-3" : "justify-center px-2"
          } py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors`}
          title={!expanded ? "Sair" : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {expanded && (
            <span className="transition-opacity duration-300">Sair</span>
          )}
        </button>
      </div>

      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
