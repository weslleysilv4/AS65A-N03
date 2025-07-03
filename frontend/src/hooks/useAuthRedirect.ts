import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuth";

export function useAuthRedirect() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, isLoading, isClient } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    // Only run on client side after hydration
    if (!isClient) return;

    // If still loading, wait
    if (isLoading) return;

    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // If not authenticated and not loading, we're ready to show login
    setIsReady(true);
  }, [isClient, isLoading, isAuthenticated, router]);

  return {
    isReady,
    isLoading: !isClient || isLoading,
    shouldRedirect: isClient && !isLoading && isAuthenticated,
  };
}
