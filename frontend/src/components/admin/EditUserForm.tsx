"use client";

import { useState } from "react";
import { useUpdateAdminUser } from "@/hooks/useAdmin";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck, X } from "lucide-react";
import type { AuthUser, UpdateUserRequest } from "@/types/api";

interface EditUserFormProps {
  user: AuthUser;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditUserForm({
  user,
  onSuccess,
  onCancel,
}: EditUserFormProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user.name || "",
    role: user.role || "PUBLISHER",
  });

  const updateUserMutation = useUpdateAdminUser();
  const { showSuccess, showError } = useErrorNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: formData,
      });

      showSuccess("Usuário atualizado com sucesso!");

      onSuccess?.();
    } catch (error) {
      showError(error as Error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      role: user.role || "PUBLISHER",
    });
    onCancel?.();
  };

  const hasChanges =
    formData.name !== (user.name || "") || formData.role !== user.role;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Editar Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              O email não pode ser alterado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "ADMIN" | "PUBLISHER") =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHER">Publisher</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Publisher: Pode criar e editar notícias
              <br />
              Admin: Acesso total ao sistema
            </p>
          </div>

          {/* Changes indicator */}
          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Alterações detectadas:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                {formData.name !== (user.name || "") && (
                  <li>
                    • Nome: &ldquo;{user.name || "Não informado"}&rdquo; →
                    &ldquo;{formData.name}&rdquo;
                  </li>
                )}
                {formData.role !== user.role && (
                  <li>
                    • Função: &ldquo;{user.role}&rdquo; → &ldquo;{formData.role}
                    &rdquo;
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={updateUserMutation.isPending || !hasChanges}
              className="flex-1"
            >
              {updateUserMutation.isPending
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
