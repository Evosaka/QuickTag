import React from "react";
import { Title } from "@components/styled";
import { colors } from "@utils/theme";
import Link from "next/link";

interface NavButtonProps {
  label: string;
  color?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function NavButton({
  label,
  color = colors.primary,
  href,
  onClick,
}: NavButtonProps) {
  const buttonStyle = {
    backgroundColor: color,
    borderRadius: "5px",
    padding: "10px",
    justifyContent: "center",
    alignItems: "center",
    display: "inline-flex", // Garante que os itens internos sejam centralizados
    width: "100%", // Garante que o botão ocupe a largura total
  };

  return onClick ? (
    <button
      onClick={onClick}
      style={buttonStyle}
      className="focus:outline-none"
    >
      <Title className="text-white">{label}</Title>
    </button>
  ) : (
    <Link href={href || "/"}>
      <div style={buttonStyle} className="focus:outline-none">
        <Title className="text-white">{label}</Title>
      </div>
    </Link>
  );
}
