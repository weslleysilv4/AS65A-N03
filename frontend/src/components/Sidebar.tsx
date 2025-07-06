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
      className={`bg-white h-screen border-r border-gray-200 transition-all duration-300 flex flex-col ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Header com logo melhorado */}
      <div className={`flex-shrink-0 ${expanded ? "p-6" : "p-3"}`}>
        <div className="flex items-center justify-between">
          <div
            className={`transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {expanded && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ELLP News</h1>
                  <p className="text-xs text-gray-500">
                    {userRole === "ADMIN" ? "Administrador" : "Publisher"}
                  </p>
                </div>
              </div>
            )}
          </div>
          {onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title={expanded ? "Recolher sidebar" : "Expandir sidebar"}
            >
              {expanded ? (
                <ChevronLeft size={18} className="text-gray-600" />
              ) : (
                <ChevronRight size={18} className="text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navegação */}
      <nav className={`flex-1 space-y-1 ${expanded ? "px-4" : "px-2"} mt-4`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center ${
                expanded ? "gap-3 px-3" : "justify-center px-2"
              } py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
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

      {/* Footer com logout */}
      <div className={`border-t border-gray-200 ${expanded ? "p-4" : "p-3"}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            expanded ? "gap-3 px-3" : "justify-center px-2"
          } py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors`}
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
