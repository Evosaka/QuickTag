import Icon from "@utils/Icons";
import { sidebarItems } from "@utils/data";
import { colors } from "@utils/theme";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { screens } from "@utils/data";

interface SideBarProps {
  isOpen: boolean;
  changeOpen: () => void;
  page: "etiquetas" | "validade" | "cadastro" | "dashboard";
}

export default function SideBar({ isOpen, changeOpen, page }: SideBarProps) {
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [selectedCadastro, setSelectedCadastro] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se a página atual é um cadastro e abre o submenu de cadastros
    if (page === "cadastro") {
      setCadastroOpen(true);
    }
  }, [page]);

  const handleCadastroClick = () => {
    setCadastroOpen(!cadastroOpen);
  };

  const handleCadastroItemClick = (name: string) => {
    setSelectedCadastro(name);
  };

  return (
    <div
      className={`h-[85vh] fixed rounded-r-3xl bg-[#242168] self-start ${
        !isOpen && "w-16"
      }`}
    >
      <div className="flex flex-col p-5">
        <div className="flex justify-between w-full justify-items-center mb-5">
          <Link href="/dashboard">
            <Icon name="home" size={18} color="white" />
          </Link>
          {isOpen && (
            <div onClick={changeOpen}>
              <Icon name="arrow-left" size={18} color="white" />
            </div>
          )}
        </div>
        <div className={`grid grid-cols-1`}>
          {sidebarItems.map((item, index) => (
            <div key={index}>
              {item.path === "cadastro" ? (
                <div
                  className={`flex py-3 items-center rounded-lg ${
                    isOpen && "-ml-3 pl-3"
                  }`}
                  style={
                    item.path === page && isOpen
                      ? {
                          backgroundColor: colors.secondary,
                        }
                      : {}
                  }
                  onClick={handleCadastroClick}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color="white"
                    className="self-center"
                  />
                  {isOpen && (
                    <>
                      <label className="ml-3 text-white text-sm pointer-events-none">
                        {item.label}
                      </label>
                      <Icon
                        name={cadastroOpen ? "chevron-up" : "chevron-down"}
                        color="white"
                        className="ml-10"
                      />
                    </>
                  )}
                </div>
              ) : (
                <Link
                  className={`flex py-3 items-center rounded-lg ${
                    isOpen && "-ml-3 pl-3"
                  }`}
                  style={
                    item.path === page && isOpen
                      ? {
                          backgroundColor: colors.secondary,
                        }
                      : {}
                  }
                  key={index}
                  href={"/" + item.path}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color="white"
                    className="self-center"
                  />
                  {isOpen && (
                    <label className="ml-3 text-white text-sm pointer-events-none">
                      {item.label}
                    </label>
                  )}
                </Link>
              )}
              {item.path === "cadastro" && cadastroOpen && isOpen && (
                <ul className="pt-2 pl-2">
                  {screens
                    .filter((s) => s.type === "cadastro")
                    .map((item, index) => (
                      <li key={index}>
                        <Link
                          className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-md ${
                            selectedCadastro === item.name ? "bg-green-500" : ""
                          }`}
                          href={{
                            pathname: "/cadastro/[name]",
                            query: { name: item.name },
                          }}
                          onClick={() => handleCadastroItemClick(item.name)}
                        >
                          {item.menu}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      {!isOpen && (
        <div
          className="absolute h-[88vh] w-20 rounded-r-3xl self-start -mt-[28vh]"
          onClick={changeOpen}
        ></div>
      )}
    </div>
  );
}
