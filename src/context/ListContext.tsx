import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";

import type { List } from "../types/List";

interface ListContextProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  avaliableListIds: string[];
  setAvaliableListIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const ListContext = createContext<ListContextProps | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avaliableListIds, setAvaliableListIds] = useState<string[]>([]);

  const fetchList = async () => {
    setLoading(true);

    try {
      const { data } = await api.get<List[]>("/lists");

      setAvaliableListIds(data.map((list) => list.id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <ListContext.Provider
      value={{
        avaliableListIds,
        setAvaliableListIds,
        loading,
        setLoading,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useListContext = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error("useListContext deve ser usado dentro de um ListProvider");
  }

  return context;
};
