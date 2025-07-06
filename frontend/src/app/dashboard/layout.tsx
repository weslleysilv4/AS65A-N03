"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isClient } = useAuthGuard();
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const getActiveItem = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/dashboard/my-news") return "my-news";
    if (pathname === "/dashboard/create-news") return "create-news";
    if (pathname === "/dashboard/pending") return "pending";
    if (pathname === "/dashboard/admin-pending") return "admin-pending";
    if (pathname === "/dashboard/users") return "users";
    if (pathname === "/dashboard/categories") return "categories";
    if (pathname === "/dashboard/settings") return "settings";
    return "dashboard";
  };

  const handleMenuClick = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        router.push("/dashboard");
        break;
      case "my-news":
        router.push("/dashboard/my-news");
        break;
      case "create-news":
        router.push("/dashboard/create-news");
        break;
      case "pending":
        router.push("/dashboard/pending");
        break;
      case "admin-pending":
        router.push("/dashboard/admin-pending");
        break;
      case "users":
        router.push("/dashboard/users");
        break;
      case "categories":
        router.push("/dashboard/categories");
        break;
      case "settings":
        router.push("/dashboard/settings");
        break;
    }
  };

  if (!isClient || isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeItem={getActiveItem()}
        onItemClick={handleMenuClick}
        userRole={user?.role}
        expanded={sidebarExpanded}
        onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarExpanded ? "ml-0" : "ml-0"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
