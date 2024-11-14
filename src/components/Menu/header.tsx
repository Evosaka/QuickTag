/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import Input from "@components/Input";
import Button from "@components/button";
import Logo from "@components/logo";
import { colors } from "@utils/theme";
import { User } from "@lib/types";

import { GET_CADASTRO_COMPANY, GET_USER } from "@lib/graphql/consts";
import UserBox from "./userBox";
import { getCadastroId } from "@src/utils/getCadastroId";

export interface HeaderProps {
  isOpen: boolean;
}

export default function Header({ isOpen }: HeaderProps) {
  const [user, setUser] = useState<User>();
  const username = Cookies.get("username");

  const { data: dbUser } = useQuery(GET_USER, {
    variables: { login: username ? username : "" },
  });

  const { data: dbCadastroCompany } = useQuery(GET_CADASTRO_COMPANY, {
    variables: { status: "ATIVO", id: getCadastroId() },
  });

  useEffect(() => {
    if (dbUser?.getUser) {
      setUser({ ...dbUser?.getUser });
    }
  }, [dbUser]);

  return (
    <header className="sticky top-0 inset-x-0 z-[48] w-full bg-white text-sm py-2.5">
      <nav className="w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
        <div className="flex items-center justify-between">
          <Logo type={isOpen ? "regular" : "mini"} />
          <div className="flex items-center justify-between gap-2 flex-grow pl-20">
            <div className="flex flex-col mx-1 whitespace-nowrap w- bg-black flex-shrink-0 border-r-">
              <Input
                type="calendar"
                label="calendário"
                showTopLabel={false}
                inputClass="rounded-xl"
              />
            </div>
            <div className="flex items-center p-2">
              <div className="flex flex-col mx-1 text-gray-500 whitespace-nowrap flex-shrink-0">
                <label className="text-sm">
                  {dbCadastroCompany?.getCadastro[0]?.fantasia}
                </label>
                <label className="text-xs">
                  {dbCadastroCompany?.getCadastro[0]?.cpfcnpj}
                </label>
              </div>
              <UserBox user={user} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
/*
            <button
              onClick={Drop}
              className="flex items-center text-start rounded-md hover:bg-gray-100 p-1"
            >
              <div className="h-11 w-11 text-start rounded-full bg-white items-center">
                <img
                  className="inline-block rounded-full"
                  src={
                    user?.imgurl
                      ? user.imgurl
                      : "https://fabideia-bucket.s3.amazonaws.com/system/fabideia/fabideia-img-user_testUser.png"
                  }
                  alt="Image Description"
                />
              </div>
              <div className="pl-5 max-lg:hidden">
                <p className="text-sm text-gray-800">
                  {limitarTexto(user?.name, 16)}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  {user?.email}
                </p>
              </div>
            </button>
  <div className="hs-dropdown">
    <div className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] sm:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 sm:w-48 hidden z-10 bg-white sm:shadow-md rounded-lg p-2 dark:bg-gray-800 sm:dark:border dark:border-gray-700 dark:divide-gray-700 before:absolute top-full sm:border before:-top-5 before:start-0 before:w-full before:h-5">
      <a
        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        href="#"
      >
        Logout
      </a>
    </div>
  </div>
*/
