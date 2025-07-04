"use client";

import { useState } from "react";
import { Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SEARCH_CONFIG = {
  MIN_WIDTH: "300px",
} as const;

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "Usuário";
  };

  const renderSearchForm = (isMobile = false) => (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
        <div className={`px-3 py-2 ${isMobile ? "" : ""}`}>
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <Input
          type="text"
          placeholder={
            isMobile ? "Buscar" : "Buscar por assunto, categoria ou tags"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border-0 bg-transparent focus:ring-0 focus:border-0 px-0 ${
            isMobile ? "" : `min-w-[${SEARCH_CONFIG.MIN_WIDTH}]`
          }`}
        />
      </div>
    </form>
  );

  const renderUserDropdown = (isMobile = false) => {
    if (!user) {
      return (
        <Button
          onClick={() => router.push("/login")}
          size="sm"
          className={isMobile ? "w-full" : ""}
        >
          Entrar
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 ${
              isMobile ? "rounded-full" : "rounded-full"
            }`}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {!isMobile && (
              <span className="hidden lg:block text-sm font-medium">
                {getUserDisplayName()}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm text-gray-700">
            {user.name || user.email}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDashboard}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderMobileMenu = () => {
    if (!isMenuOpen) return null;

    return (
      <div className="md:hidden py-4 border-t border-gray-200">
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Início
          </Link>
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-200">
          {renderSearchForm(true)}
        </div>

        {!user && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {renderUserDropdown(true)}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                ELLP News
              </span>
            </div>

            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium ml-6"
            >
              Início
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {renderSearchForm()}
            {renderUserDropdown()}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user && renderUserDropdown(true)}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {renderMobileMenu()}
      </div>
    </header>
  );
}
