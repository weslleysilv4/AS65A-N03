"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Users, Shield, Edit, UserPlus } from "lucide-react";

export default function UserStats() {
  const { data: users = [], isLoading } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const publisherCount = users.filter((u) => u.role === "PUBLISHER").length;
  const usersWithoutName = users.filter((u) => !u.name).length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers === 1 ? "usuário cadastrado" : "usuários cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              acesso total ao sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publishers</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {publisherCount}
            </div>
            <p className="text-xs text-muted-foreground">criação de notícias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={totalUsers > 0 ? "default" : "secondary"}>
                {totalUsers > 0 ? "Ativo" : "Vazio"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? "Sistema configurado" : "Requer usuários"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users List */}
      {totalUsers > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Edit className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {user.name || "Nome não informado"}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.role === "ADMIN" ? "Admin" : "Publisher"}
                  </Badge>
                </div>
              ))}
              {users.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    e mais {users.length - 5} usuário
                    {users.length - 5 !== 1 ? "s" : ""}...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalUsers === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhum usuário cadastrado
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Comece criando usuários para que possam acessar e gerenciar o
              sistema de notícias.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Issues Alert */}
      {usersWithoutName > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                Atenção
              </Badge>
              <p className="text-sm text-orange-800">
                {usersWithoutName} usuário{usersWithoutName !== 1 ? "s" : ""}{" "}
                sem nome cadastrado
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
