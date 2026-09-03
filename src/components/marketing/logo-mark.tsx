import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-xl ${className ?? ""}`}
    >
      <Image src="/logo.png" alt="Malaka.uz" fill priority className="object-cover" sizes="48px" />
    </div>
  );
}
