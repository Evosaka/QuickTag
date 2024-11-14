import Menu from "@components/Menu";
import { Chart } from "@components/chart";
import DashboardBox from "@components/dashboardBox";
import DynamicTable from "@components/DynamicTable";
import { Etiqueta as EtiquetaTypes } from "@src/lib/types";

import { etiquetasColumns, productBox, tagsByGroupsColumns } from "@utils/data";
import { useQuery } from "@apollo/client";
import { GET_ETIQUETAS } from "@src/lib/graphql/consts";
import { useEffect, useMemo, useState } from "react";
import Spin from "@src/components/Spin";

interface GroupMapped {
  position?: number;
  grupoId: number;
  descGrupo: string;
  quantity: number;
}

export default function Dashboard() {
  const [etiquetas, setEtiquetas] = useState<EtiquetaTypes[]>([]);

  const { data: mainDB, refetch } = useQuery(GET_ETIQUETAS, {
    variables: {},
  });

  const etiquetasPorDia = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyCounts = Array(daysInMonth).fill(0);

    etiquetas?.forEach((etiqueta) => {
      if (etiqueta?.dtManipulacao) {
        const [year, month, day] = etiqueta.dtManipulacao
          .split("-")
          .map(Number);
        if (year === currentYear && month - 1 === currentMonth) {
          dailyCounts[day - 1]++;
        }
      }
    });

    return dailyCounts;
  }, [etiquetas]);

  const etiquetasPorMes = useMemo(() => {
    const meses = Array(12).fill(0);

    etiquetas.forEach(({ dtManipulacao }) => {
      if (dtManipulacao) {
        const date = new Date(dtManipulacao);
        const mes = date.getMonth();

        meses[mes]++;
      }
    });

    return meses;
  }, [etiquetas]);

  const tagsByGroup = useMemo(() => {
    const result = etiquetas.reduce<GroupMapped[]>((acc, etiqueta) => {
      const { grupoId, descGrupo } = etiqueta;

      const findedGroup = acc.find(
        (grupo) => grupo.grupoId === grupoId && grupo.descGrupo === descGrupo
      );

      if (findedGroup) {
        findedGroup.quantity++;
      } else if (grupoId !== undefined && descGrupo !== undefined) {
        acc.push({ grupoId, descGrupo, quantity: 1 });
      }

      return acc;
    }, []);

    const sortedResult = result.sort((a, b) => b.quantity - a.quantity);
    return sortedResult.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }, [etiquetas]);

  const lineSeriesChartLine = [
    {
      name: "Etiquetas",
      data: etiquetasPorMes,
    },
  ];

  const seriesChartColumn = [
    {
      name: "Etiquetas",
      data: etiquetasPorDia,
    },
  ];

  useEffect(() => {
    setEtiquetas([]);
    if (mainDB && mainDB.getErpEtiqueta && mainDB.getErpEtiqueta.length > 0) {
      const sortedItems = mainDB.getErpEtiqueta.sort(
        (a: any, b: any) => b.id - a.id
      );

      setEtiquetas([...sortedItems]);
    }
  }, [mainDB]);

  return (
    <Menu page="dashboard">
      {!etiquetas?.length && (
        <div className="fixed inset-0 z-[100]">
          <Spin msg={"Buscando informações, aguarde..."} />
        </div>
      )}
      <div className="flex flex-col  p-5 justify-between">
        <div className="flex max-lg:flex-col justify-between pb-2 overflow-x-auto">
          {productBox.map((item, index) => (
            <DashboardBox key={index} item={item} />
          ))}
        </div>
        <div className="flex max-lg:flex-col gap-6 justify-between py-2">
          <Chart
            type="line"
            lineSeries={lineSeriesChartLine}
            label="Evolução das Etiquetas Geradas"
          />
          <Chart
            columnSeries={seriesChartColumn}
            type="column"
            label="Etiquetas Geradas Mês Atual"
          />
        </div>
        <div className="flex max-lg:flex-col gap-6 py-4 justify-between">
          <DynamicTable
            columns={tagsByGroupsColumns}
            data={tagsByGroup}
            label="Etiquetas por Grupo"
            className="lg:w-[49%] max-lg:py-2"
            max={8}
          />
          <DynamicTable
            columns={etiquetasColumns}
            data={etiquetas}
            label="Últimas Etiquetas Geradas"
            className="lg:w-[49%] max-lg:py-2 overflow-x-scroll scrollbar"
            max={6}
          />
        </div>
      </div>
    </Menu>
  );
}
