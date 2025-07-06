"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Loading from "@/components/Loading";
import PublicHeader from "@/components/PublicHeader";
import { LoginForm } from "@/components/login";

export default function LoginPage() {
  const { isReady, isLoading, shouldRedirect } = useAuthRedirect();

  if (isLoading) {
    return (
      <Loading
        message="Verificando autenticação..."
        className="min-h-screen flex items-center justify-center bg-white"
      />
    );
  }

  if (shouldRedirect) {
    return null;
  }

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md mx-auto p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
