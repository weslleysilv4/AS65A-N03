"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  fallbackText,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-gray-500 text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">
            {fallbackText || "Imagem não disponível"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse ${className}`}
        >
          <div className="text-gray-400">Carregando...</div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={() => {
          console.error("Erro ao carregar imagem:", src);
          setHasError(true);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        priority={false}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </>
  );
}
