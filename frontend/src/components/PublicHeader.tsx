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
          </div>

          <nav className="hidden md:flex gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Início
            </Link>
            <Link
              href="/news"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Notícias
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <div className="px-3 py-2">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar por assunto, categoria ou tags"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus:ring-0 focus:border-0 px-0 min-w-[300px]"
                />
              </div>
            </form>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 rounded-full"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user.name || user.email?.split("@")[0] || "Usuário"}
                    </span>
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
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/login")} size="sm">
                Entrar
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
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
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Início
              </Link>
              <Link
                href="/news"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Notícias
              </Link>
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <div className="px-3 py-2">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 bg-transparent focus:ring-0 focus:border-0 px-0"
                  />
                </div>
              </form>
            </div>

            {!user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  Entrar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
