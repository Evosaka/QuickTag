import { Title } from "@components/styled";
import Menu from "@components/Menu";
import Button from "@components/button";
import Input from "@components/Input";
import Icon from "@utils/Icons";
import { colors } from "@utils/theme";

export default function NovaEtiqueta() {
  const nome = [
    "Fulano de Tal",
    "Nicolas Rocha",
    "Fulano de Tal",
    "Anderson Luiz",
    "Fulano de Tal",
    "Fulano de Tal",
    "Fulano de Tal",
    "Fulano de Tal",
    "Fulano de Tal",
  ];
  return (
    <Menu page="etiquetas">
      <div className="flex flex-col justify-between p-5">
        <h1 className="text-[#242168] text-2xl font-bold">Nova Etiqueta</h1>
        <div className="flex flex-col">
          <h1 className="text-lg text-[#242168] font-bold">
            Selecione seu Nome
          </h1>
          <div className="overflow-x-auto">
            <div className="grid grid-rows-1 grid-flow-col gap-4">
              {nome.map((item, index) => (
                <div
                  key={index}
                  className="py-3 px-5 bg-zinc-50 rounded-lg shadow-sm w-40 text-gray-500 text-sm text-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg text-[#242168] font-bold py-1">
            Selecione o Grupo
          </h1>
          <div className="flex justify-between py-1">
            <div className="w-4/5">
              <Input
                label="Opções de grupo"
                type="dropdown"
                showTopLabel={false}
              />
            </div>
            <Button color="white" className="w-[19%]">
              <label className="max-lg:hidden">Novo Grupo</label>
              <Icon name="plus" className="lg:hidden" color="white" size={25} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-lg text-[#242168] font-bold py-1">
            Selecione o Produto
          </label>
          <div className="flex justify-between py-1">
            <div className="w-4/5">
              <Input
                label="Opções de grupo"
                type="dropdown"
                showTopLabel={false}
              />
            </div>
            <Button color="white" className="w-[19%]">
              <>
                <label className="max-lg:hidden">Novo Produto</label>
                <Icon
                  name="plus"
                  className="lg:hidden"
                  color="white"
                  size={25}
                />
              </>
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-lg text-[#242168] font-bold py-1">
            Etiqueta
          </label>
          <div className="flex max-lg:flex-col items-center justify-center py-1">
            <div className="flex flex-col justify-between p-5 mr-3 w-[22rem] h-[28rem] max-lg:my-5 rounded-md border border-neutral-500 text-gray-800 ">
              <div className="flex justify-between font-bold items-center">
                <h1 className="text-2xl">Nome do Produto</h1>
                <label className="text-sm">01 de 04</label>
              </div>
              <div className="flex flex-col font-bold">
                <label className="text-base">Resfriado | 000 gramas</label>
                <label className="text-base">
                  Válido até: 00/00/0000 - 00h00
                </label>
              </div>
              <div className="border w-full border-black" />
              <div className="flex flex-col">
                <div className="flex justify-between text-base items-center">
                  <label className="font-bold">Manipulado em:</label>
                  <label className="font-normal">00/00/0000 - 00h00</label>
                </div>
                <div className="flex justify-between text-base items-center">
                  <label className="font-bold">Forn/Marca:</label>
                  <label className="font-normal">
                    Nome do Fornecedor/Marca
                  </label>
                </div>
                <div className="flex justify-between text-base items-center">
                  <label className="font-bold">Lote:</label>
                  <label className="font-normal">0000</label>
                </div>
                <div className="flex justify-between text-base items-center">
                  <label className="font-bold">SIF:</label>
                  <label className="font-normal">00000</label>
                </div>
              </div>
              <div className="flex justify-between h-40">
                <div className="flex flex-col justify-between w-[85%] mt-2">
                  <div className="border w-full border-black" />
                  <div className="flex text-base items-center">
                    <label className="font-bold">Responsável: </label>
                    <label className="font-normal">Nome do Responsável</label>
                  </div>
                  <div className="flex flex-col text-sm">
                    <div className="flex items-center">
                      <label className="font-bold">Local: </label>
                      <label className="font-normal">
                        Nome do local de Armazenamento
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-bold">CNPJ: </label>
                      <label className="font-normal">00.000.000/0000-00</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-bold">CEP: </label>
                      <label className="font-normal">000000-000</label>
                    </div>
                    <label>Rua Fulano de Tal, 236</label>
                    <label>Tarumã | São Paulo - SP</label>
                  </div>
                </div>
                <div className="h-auto w-[10%] bg-black" />
              </div>
            </div>
            <div className="lg:w-1/2 h-auto ml-3 flex flex-col justify-between text-gray-800">
              <h1 className="font-bold text-base">
                Preencha com os dados do Produto
              </h1>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <Input
                    label="Modelo de Etiqueta"
                    placeholder="Modelo X"
                    type="text"
                  />
                </div>
                <div className="flex justify-between py-1">
                  <div className="w-[24%]">
                    <Input label="Peso/Qtd" placeholder="0000000" type="text" />
                  </div>
                  <div className="w-[24%]">
                    <Input
                      label="Unidade"
                      placeholder="Selecione"
                      type="dropdown"
                    />
                  </div>
                  <div className="w-[24%]">
                    <Input label="Lote" placeholder="0000000" type="text" />
                  </div>
                  <div className="w-[24%]">
                    <Input label="SIF" placeholder="0000000" type="text" />
                  </div>
                </div>
                <div className="flex justify-between items-end py-1">
                  <div className="w-[24%]">
                    <Input
                      label="Manipulado em"
                      placeholder="00/00/0000"
                      type="text"
                    />
                  </div>
                  <div className="w-[24%]">
                    <Input
                      label="horario"
                      placeholder="00:00"
                      type="text"
                      showTopLabel={false}
                    />
                  </div>
                  <div className="w-[51%] flex flex-row justify-between border items-end p-1 -mb-1 -mr-1 rounded-md">
                    <div className="w-[49%]">
                      <Input
                        label="Valido até"
                        placeholder="00/00/0000"
                        type="text"
                      />
                    </div>
                    <div className="w-[49%] flex flex-col h-auto justify-between">
                      <div className="p-2 justify-end flex">
                        <button>
                          <Icon name="pencil" />
                        </button>
                      </div>
                      <Input
                        label="horario"
                        placeholder="00:00"
                        type="text"
                        showTopLabel={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <div className="w-[48%]">
                    <Input
                      label="Fornecedor"
                      placeholder="Nome do Fornecedor"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-[24%] flex flex-col">
                  <Title
                    $align="flex-start"
                    className="text-sm  text-slate-600 font-medium"
                  >
                    Gerar Código
                  </Title>
                  <Button
                    color="white"
                    backgroundColor={colors.secondary}
                    className="mt-2 h-"
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.375 9.5625C6.375 9.28071 6.48694 9.01046 6.6862 8.8112C6.88546 8.61194 7.15571 8.5 7.4375 8.5C7.71929 8.5 7.98954 8.61194 8.1888 8.8112C8.38806 9.01046 8.5 9.28071 8.5 9.5625V24.4375C8.5 24.7193 8.38806 24.9895 8.1888 25.1888C7.98954 25.3881 7.71929 25.5 7.4375 25.5C7.15571 25.5 6.88546 25.3881 6.6862 25.1888C6.48694 24.9895 6.375 24.7193 6.375 24.4375V9.5625ZM10.625 9.5625C10.625 9.28071 10.7369 9.01046 10.9362 8.8112C11.1355 8.61194 11.4057 8.5 11.6875 8.5C11.9693 8.5 12.2395 8.61194 12.4388 8.8112C12.6381 9.01046 12.75 9.28071 12.75 9.5625V24.4375C12.75 24.7193 12.6381 24.9895 12.4388 25.1888C12.2395 25.3881 11.9693 25.5 11.6875 25.5C11.4057 25.5 11.1355 25.3881 10.9362 25.1888C10.7369 24.9895 10.625 24.7193 10.625 24.4375V9.5625ZM14.875 9.5625C14.875 9.28071 14.9869 9.01046 15.1862 8.8112C15.3855 8.61194 15.6557 8.5 15.9375 8.5C16.2193 8.5 16.4895 8.61194 16.6888 8.8112C16.8881 9.01046 17 9.28071 17 9.5625V24.4375C17 24.7193 16.8881 24.9895 16.6888 25.1888C16.4895 25.3881 16.2193 25.5 15.9375 25.5C15.6557 25.5 15.3855 25.3881 15.1862 25.1888C14.9869 24.9895 14.875 24.7193 14.875 24.4375V9.5625ZM19.125 9.5625C19.125 9.28071 19.2369 9.01046 19.4362 8.8112C19.6355 8.61194 19.9057 8.5 20.1875 8.5H22.3125C22.5943 8.5 22.8645 8.61194 23.0638 8.8112C23.2631 9.01046 23.375 9.28071 23.375 9.5625V24.4375C23.375 24.7193 23.2631 24.9895 23.0638 25.1888C22.8645 25.3881 22.5943 25.5 22.3125 25.5H20.1875C19.9057 25.5 19.6355 25.3881 19.4362 25.1888C19.2369 24.9895 19.125 24.7193 19.125 24.4375V9.5625ZM25.5 9.5625C25.5 9.28071 25.6119 9.01046 25.8112 8.8112C26.0105 8.61194 26.2807 8.5 26.5625 8.5C26.8443 8.5 27.1145 8.61194 27.3138 8.8112C27.5131 9.01046 27.625 9.28071 27.625 9.5625V24.4375C27.625 24.7193 27.5131 24.9895 27.3138 25.1888C27.1145 25.3881 26.8443 25.5 26.5625 25.5C26.2807 25.5 26.0105 25.3881 25.8112 25.1888C25.6119 24.9895 25.5 24.7193 25.5 24.4375V9.5625Z"
                        fill="white"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="w-[24%]">
                  <Input
                    label="Total p/ Imprimir"
                    placeholder="00"
                    type="counter"
                    inputClass="h-10"
                  />
                </div>
                <Button
                  color="white"
                  backgroundColor={colors.secondary}
                  className="w-[48%] self-end"
                >
                  Gerar Etiqueta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}
