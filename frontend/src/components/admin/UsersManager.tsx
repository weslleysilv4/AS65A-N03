"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import QuickRoleChanger from "./QuickRoleChanger";
import { Users, Search, UserPlus, Edit } from "lucide-react";
import type { AuthUser } from "@/types/api";

export default function UsersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  const { data: users = [], isLoading, error } = useAdminUsers();

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSuccess = () => {
    setIsCreating(false);
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
  };

  const handleEdit = (user: AuthUser) => {
    setEditingUser(user);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Erro ao carregar usuários</h3>
        <p className="text-red-600 text-sm mt-1">
          Não foi possível carregar os usuários. Tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários do sistema</p>
        </div>
        {!isCreating && !editingUser && (
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {/* Create User Form */}
      {isCreating && (
        <div className="flex justify-center">
          <CreateUserForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="flex justify-center">
          <EditUserForm
            user={editingUser}
            onSuccess={handleEditSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredUsers.length} usuário
            {filteredUsers.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <>
                    <h3 className="font-medium mb-2">
                      Nenhum usuário encontrado
                    </h3>
                    <p className="text-sm">
                      Tente ajustar sua pesquisa ou criar um novo usuário.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium mb-2">Nenhum usuário criado</h3>
                    <p className="text-sm mb-4">
                      Comece criando seu primeiro usuário do sistema.
                    </p>
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Criar Primeiro Usuário
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {user.name || "Nome não informado"}
                          </h3>
                          <QuickRoleChanger user={user} />
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>ID: {user.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo dos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {users.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "ADMIN").length}
                </div>
                <div className="text-sm text-gray-500">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.role === "PUBLISHER").length}
                </div>
                <div className="text-sm text-gray-500">Publishers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => !u.name).length}
                </div>
                <div className="text-sm text-gray-500">Sem Nome</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
