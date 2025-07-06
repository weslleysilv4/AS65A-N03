import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";

export function useAuthRedirect() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, isLoading, isClient } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isClient) return;
    if (isLoading) return;

    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    setIsReady(true);
  }, [isClient, isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isClient) return;

    const handleAuthLogin = () => {
      setTimeout(() => {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (token) {
          router.push("/dashboard");
        }
      }, 200);
    };

    window.addEventListener("auth-login", handleAuthLogin);

    return () => {
      window.removeEventListener("auth-login", handleAuthLogin);
    };
  }, [isClient, router]);

  return {
    isReady,
    isLoading: !isClient || isLoading,
    shouldRedirect: isClient && !isLoading && isAuthenticated,
  };
}
