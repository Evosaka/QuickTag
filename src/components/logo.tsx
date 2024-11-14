import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  type?: "regular" | "mini";
}

export default function Logo({
  href = "",
  className = "",
  type = "regular",
}: LogoProps) {
  return (
    <Link href={href} className={`relative ${className}`}>
      <Image
        src={type === "mini" ? "/mini_logo.svg" : "/logo.svg"}
        alt="Logo"
        width={150}
        height={52}
        style={{
          objectFit: "contain",
        }}
      />
    </Link>
  );
}
