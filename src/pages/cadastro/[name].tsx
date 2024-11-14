import React, { useEffect, useState } from "react";
import Menu from "@components/Menu";
import Input from "@components/Input";
import Icon from "@utils/Icons";
import { useRouter } from "next/router";
import ArmazenamentoScreen from "@src/screens/Armazenamento";
import EtiquetaScreen from "@src/screens/Etiqueta";
import GroupScreen from "@src/screens/GroupScreen";
import ProductScreen from "@src/screens/ProductScreen";
import TagModelScreen from "@src/screens/TagModels";
import UserScreen from "@src/screens/UserScreen";
import { Screen } from "@src/lib/types";
import { screens } from "@utils/data";
import { PlusIcon } from "@heroicons/react/20/solid";

import { useAppContext } from "@lib/context/appContext";
import SupplierScreen from "@src/screens/SupplierScreen";
import UnitScreen from "@src/screens/UnitScreen";
import LocalArmazenamentoScreen from "@src/screens/LocalArmazenamento";

export default function Cadastro() {
  const [screen, setScreen] = useState<Screen>();
  const router = useRouter();
  const screenName = router.query.name;

  const { onNewRecord } = useAppContext();

  useEffect(() => {
    setScreen(screens.filter((s) => s.name === screenName)[0]);
  }, [screenName]);

  return (
    <Menu page="cadastro">
      <div className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[#242168] text-2xl font-bold">{screen?.title}</h1>

          {screen?.searchBar && (
            <div className="flex max-lg:flex-col justify-between py-2">
              <div className="max-lg:py-2 lg:w-3/4 flex ">
                <div className="w-full">
                  <Input
                    label="Pesquisa"
                    placeholder="label"
                    type="text"
                    showTopLabel={false}
                  />
                </div>
                <div className="w-10 h-10 rounded-md bg-zinc-400 p-2.5 lg:ml-2">
                  <Icon name="magnify" color="white" size={20} />
                </div>
              </div>
              <div className="max-lg:py-2 lg:w-1/4 flex lg:ml-2">
                <div className="w-full">
                  <Input
                    label="Últimos Cadastrados"
                    placeholder="label"
                    type="text"
                    showTopLabel={false}
                  />
                </div>
                <div className="w-10 h-10 rounded-md bg-zinc-400 p-2.5 lg:ml-2">
                  <Icon name="filter" color="white" size={20} />
                </div>
              </div>
            </div>
          )}
          {/* <PlusIcon
            className="cursor-pointer h-12 w-12 text-[#242168]"
            aria-hidden="true"
            onClick={onNewRecord}
          /> */}
        </div>
        {screen?.name === "groups" ? (
          <GroupScreen mode="INSERT" />
        ) : screen?.name === "armazenamento" ? (
          <ArmazenamentoScreen mode="INSERT" />
        ) : screen?.name === "etiqueta" ? (
          <EtiquetaScreen mode="INSERT" />
        ) : screen?.name === "products" ? (
          <ProductScreen mode="INSERT" />
        ) : screen?.name === "suppliers" ? (
          <SupplierScreen mode="INSERT" />
        ) : screen?.name === "units" ? (
          <UnitScreen mode="INSERT" />
        ) : screen?.name === "local-armazenamento" ? (
          <LocalArmazenamentoScreen mode="INSERT" />
        ) : (
          <UserScreen mode="INSERT" />
        )}
      </div>
    </Menu>
  );
}
