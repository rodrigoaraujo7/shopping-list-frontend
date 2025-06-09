import { useState } from "react";

import { Card } from "./components/Card";
import { useFolderContext } from "./context/FolderContext";
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";
import { Input } from "./components/Input";

import noData from "./assets/svg/no-data.svg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type AddFolderFormData,
  AddFolderFormSchema,
} from "./types/zod/add-folder-form";

import { api } from "./services/api";
import { AnimatePresence } from "motion/react";
import { RxListBullet } from "react-icons/rx";

export const App = () => {
  const [addFolderModal, setAddFolderModal] = useState<boolean>(false);

  const { folders } = useFolderContext();

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_768px_1fr]">
      <div className="col-auto p-4 md:col-start-2 md:col-end-3">
        {folders.length <= 0 ? (
          <div className="flex justify-center items-center h-full">
            <Card styles="outline" flex="center" style={{ width: "360px" }}>
              <img src={noData} alt="" width={300} />

              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Comece criando uma pasta
                </h1>
                <h2 className="text-sm font-medium text-gray-500">
                  Sua lista de compras inteligente será exibida aqui. Comece
                  criando uma nova pasta
                </h2>
              </div>

              <Button onClick={() => setAddFolderModal(true)}>
                Adicionar nova pasta
              </Button>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-3 h-full">
            {folders.map((folder) => (
              <Card key={folder.id} className="cursor-pointer">
                <h1 className="font-bold text-lg text-gray-700">
                  {folder.title}
                </h1>

                {folder.description && (
                  <h2 className="font-normal text-sm text-gray-500">
                    {folder.description}
                  </h2>
                )}

                <div className="flex items-center gap-1">
                  <RxListBullet color="#667085" />
                  <span className="font-normal text-sm text-gray-500">
                    {folder.items.filter((item) => item.checked).length}/
                    {folder.items.length} itens completos
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {addFolderModal && (
          <AddFolderForm onClose={() => setAddFolderModal(false)} />
        )}
      </AnimatePresence>
    </main>
  );
};

const AddFolderForm = ({ onClose }: { onClose: () => void }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFolderFormData>({
    resolver: zodResolver(AddFolderFormSchema),
  });

  const onSubmit = async (data: AddFolderFormData) => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const response = await api.post("/folder", {
        title: data.title,
        description: data.description,
      });

      setFolders((folder) => [...folder, response.data]);

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal title="Adicionar nova pasta" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome da pasta"
          placeholder="-"
          {...register("title")}
          styles={errors.title && "error"}
        />

        <Input
          id="description"
          label="Descrição da pasta"
          placeholder="-"
          {...register("description")}
        />

        <Button isFetching={isFetching}>Criar</Button>
      </form>
    </Modal>
  );
};
