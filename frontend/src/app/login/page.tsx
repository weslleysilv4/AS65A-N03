"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import Loading from "@/components/Loading";
import { LoginLayout, LoginBackground, LoginForm } from "@/components/login";

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
    <LoginLayout>
      <LoginBackground />
      <LoginForm />
    </LoginLayout>
  );
}
