"use client";

import { useState } from "react";
import { useUpdateAdminUser } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Check, X } from "lucide-react";
import type { AuthUser } from "@/types/api";

interface QuickRoleChangerProps {
  user: AuthUser;
  disabled?: boolean;
}

export default function QuickRoleChanger({
  user,
  disabled = false,
}: QuickRoleChangerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "PUBLISHER">(
    user.role || "PUBLISHER"
  );

  const updateUserMutation = useUpdateAdminUser();

  const handleRoleChange = async (newRole: "ADMIN" | "PUBLISHER") => {
    if (newRole === user.role) {
      setIsEditing(false);
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: { role: newRole },
      });

      setIsEditing(false);

      if (process.env.NODE_ENV === "development") {
      }
    } catch (error) {
      console.error("Erro ao alterar role:", error);
      setSelectedRole(user.role || "PUBLISHER");
    }
  };

  const handleCancel = () => {
    setSelectedRole(user.role || "PUBLISHER");
    setIsEditing(false);
  };

  if (disabled) {
    return (
      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
        <Shield className="h-3 w-3 mr-1" />
        {user.role === "ADMIN" ? "Admin" : "Publisher"}
      </Badge>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedRole}
          onValueChange={(value: "ADMIN" | "PUBLISHER") =>
            setSelectedRole(value)
          }
          disabled={updateUserMutation.isPending}
        >
          <SelectTrigger className="w-auto h-6 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PUBLISHER">Publisher</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <button
            onClick={() => handleRoleChange(selectedRole)}
            disabled={updateUserMutation.isPending}
            className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
            title="Confirmar"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            disabled={updateUserMutation.isPending}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            title="Cancelar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="inline-flex items-center"
      disabled={updateUserMutation.isPending}
    >
      <Badge
        variant={user.role === "ADMIN" ? "default" : "secondary"}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Shield className="h-3 w-3 mr-1" />
        {user.role === "ADMIN" ? "Admin" : "Publisher"}
      </Badge>
    </button>
  );
}
