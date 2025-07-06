import { ReactNode } from "react";
import LoginHeader from "./LoginHeader";

interface LoginLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function LoginLayout({
  children,
  className = "",
}: LoginLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <LoginHeader />
      <main className="flex justify-center px-4 md:px-8 lg:px-16 xl:px-40 py-4 md:py-6 lg:py-8 min-h-[calc(100vh-73px)]">
        <div className="w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
