import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Cookies from "js-cookie";

import { User } from "@src/lib/types";
import Icon from "@src/utils/Icons";

interface userProps {
  user: User | undefined;
}

const UserBox = ({ user }: userProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const logout = () => {
    Cookies.remove("fabtoken");
    Cookies.remove("username");
    router.push("/");
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <button
        type="button"
        className="flex w-full items-center text-start rounded-md hover:bg-gray-100 p-1"
        onClick={toggleDropdown}
      >
        <div className="h-11 w-11 text-start rounded-full bg-white items-center border">
          <Image
            className="inline-block rounded-full"
            src={
              user?.imgurl
                ? user?.imgurl
                : "https://fabideia-bucket.s3.amazonaws.com/system/fabideia/fabideia-img-user_testUser.png"
            }
            alt="Foto do Usuário"
            width={42}
            height={42}
          />
        </div>
        <div className="pl-5 max-lg:hidden">
          <p className="text-sm text-gray-800">
            {user &&
              (user.name?.length <= 18
                ? user.name
                : user.name?.substring(0, 18) + "...")}
          </p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-3 px-5 -m-1 rounded-t-lg">
            <a
              className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              href="#"
            >
              <Icon name="users" size={20} />
              Minha Conta
            </a>
          </div>
          <div className="py-3 px-5 -m-1 rounded-t-lg">
            <button
              className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => logout()}
            >
              <Icon name="log-out" size={20} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBox;
