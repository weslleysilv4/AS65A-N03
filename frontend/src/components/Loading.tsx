interface LoadingProps {
  message?: string;
  className?: string;
}

export default function Loading({
  message = "Carregando...",
  className = "min-h-screen flex items-center justify-center bg-gray-100",
}: LoadingProps) {
  return (
    <div className={className}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
