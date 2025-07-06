import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ELLP News",
  description: "Acesso administrativo ao sistema ELLP News",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
