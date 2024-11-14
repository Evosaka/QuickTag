import Header from "@components/Menu/header";
import SideBar from "@components/Menu/sidebar";
import { Inter } from "next/font/google";
import { useState } from "react";
import Spin from "@components/Spin";

import { useAppContext } from "@lib/context/appContext";

const inter = Inter({ subsets: ["latin"] });

interface menuProps {
  children: React.ReactNode;
  page: "etiquetas" | "validade" | "cadastro" | "dashboard";
}

export default function Menu({ children, page }: menuProps) {
  const [isOpen, setIsOpen] = useState(true);

  const { spinMsg } = useAppContext();

  const close = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Header isOpen={isOpen} />
      <div className="bg-white max-h-screen">
        <SideBar isOpen={isOpen} changeOpen={close} page={page} />
        <div
          className={`w-full bg-white pr-2 overflow-y-auto pl-16 ${
            isOpen && "pl-48"
          }`}
        >
          <div></div>
          {children}
        </div>
      </div>
      {spinMsg && (
        <div className="fixed inset-0 z-[100]">
          <Spin msg={spinMsg} />
        </div>
      )}
    </>
  );
}
