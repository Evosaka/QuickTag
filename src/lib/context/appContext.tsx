import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

const initialState: string = "";

// Criando o tipo para o contexto que inclui o estado e a função de atualização
interface AppContextType {
  spinMsg: string;
  setSpinMsg: React.Dispatch<React.SetStateAction<string>>;
  onNewRecord: () => void;
  setActNewRecord: (act: () => void) => void;
}

// Criando o contexto com um valor padrão
const AppContext = createContext<AppContextType>({
  spinMsg: initialState,
  setSpinMsg: () => {},
  onNewRecord: () => {}, // Função padrão vazia
  setActNewRecord: () => {},
});

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [spinMsg, setSpinMsg] = useState<string>(initialState);
  const [actNewRecord, setActRecord] = useState<() => void>(() => () => {});

  const onNewRecord = useCallback(() => {
    actNewRecord();
  }, [actNewRecord]);

  const setActNewRecord = useCallback((act: () => void) => {
    setActRecord(() => act); // Permite que o componente filho defina a ação
  }, []);

  return (
    <AppContext.Provider
      value={{ spinMsg, setSpinMsg, onNewRecord, setActNewRecord }}
    >
      {children}
    </AppContext.Provider>
  );
};
