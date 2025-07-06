import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useErrorNotification } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormProps {
  className?: string;
}

const FORM_CONFIG = {
  MIN_EMAIL_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
} as const;

export default function LoginForm({ className = "" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: loginUser, isPending, error } = useLogin();
  const { showError } = useErrorNotification();

  const isFormValid =
    email.length >= FORM_CONFIG.MIN_EMAIL_LENGTH &&
    password.length >= FORM_CONFIG.MIN_PASSWORD_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      loginUser({ email, password });
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const handleForgotPassword = () => {
    showError(new Error('Função "Esqueceu a senha?" ainda não implementada'));
  };

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-gray-900 leading-tight">
          Acesso Administrativo
        </h2>
      </div>

      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              role="alert"
              aria-live="polite"
            >
              {error.message ||
                "Erro ao fazer login. Verifique suas credenciais."}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">
                Email ou nome de usuário
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Nome de usuário ou e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-3 md:p-4 rounded-lg w-full"
                required
                disabled={isPending}
                autoComplete="email"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-3 md:p-4 rounded-lg w-full"
                required
                disabled={isPending}
                autoComplete="current-password"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-2 md:py-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={isPending}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm md:text-base text-gray-900 cursor-pointer"
                >
                  Lembrar de mim
                </label>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="pb-3">
              <Button
                type="button"
                variant="link"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 p-0 h-auto"
                disabled={isPending}
                onClick={handleForgotPassword}
              >
                Esqueceu a senha?
              </Button>
            </div>

            {/* Submit Button */}
            <div className="py-3">
              <Button
                type="submit"
                disabled={isPending || !isFormValid}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-lg font-bold text-sm md:text-base transition-colors disabled:cursor-not-allowed"
                aria-describedby={isPending ? "login-status" : undefined}
              >
                {isPending ? "Entrando..." : "Entrar"}
              </Button>
              {isPending && (
                <div id="login-status" className="sr-only" aria-live="polite">
                  Fazendo login, aguarde...
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
