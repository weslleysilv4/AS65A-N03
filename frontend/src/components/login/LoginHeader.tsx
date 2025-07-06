import Image from "next/image";

export default function LoginHeader() {
  return (
    <header className="flex justify-between items-center px-4 md:px-8 lg:px-10 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-4 h-4 relative">
          <Image
            src="/icon-ELLP-News2.png"
            alt="ELLP News Icon"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-base md:text-lg font-bold text-gray-900">
          ELLP News
        </h1>
      </div>
    </header>
  );
}
