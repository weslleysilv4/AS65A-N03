import Image from "next/image";

export default function LoginBackground() {
  return (
    <div className="relative w-full h-32 md:h-48 lg:h-[218px] mb-4 md:mb-6 lg:mb-8 rounded-lg overflow-hidden">
      <Image
        src="/login-background.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
