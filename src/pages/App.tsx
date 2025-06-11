import { useState } from "react";

import { AnimatePresence } from "motion/react";

import { useNavigate } from "react-router";

import { Card } from "../components/Card";
import { useFolderContext } from "../context/FolderContext";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { Avatar } from "../components/Avatar";
import { MainGrid } from "../components/MainGrid";

import noData from "../assets/svg/no-data.svg";

import { RxListBullet, RxPlus } from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type AddFolderFormData,
  AddFolderFormSchema,
} from "../types/zod/add-folder-form";

import { api } from "../services/api";

export const App = () => {
  const [addFolderModal, setAddFolderModal] = useState<boolean>(false);

  const { folders, loading } = useFolderContext();

  const navigate = useNavigate();

  return (
    <MainGrid>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CgSpinner className="animate-spin" size={75} color="#7f56d9" />
        </div>
      ) : (
        <>
          {folders.length <= 0 ? (
            <div className="flex justify-center items-center h-full">
              <Card styles="outline" flex="center" style={{ width: "360px" }}>
                <img src={noData} alt="no-data" width={300} />

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
                <Card
                  key={folder.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/folder/${folder.id}`)}
                >
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

          {folders.length >= 1 && (
            <Avatar
              style={{
                position: "absolute",
                right: 16,
                bottom: 32,
                padding: 16,
              }}
              onClick={() => setAddFolderModal(true)}
            >
              <RxPlus color="#7f56d9" size={24} />
            </Avatar>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        {addFolderModal && (
          <AddFolderForm onClose={() => setAddFolderModal(false)} />
        )}
      </AnimatePresence>
    </MainGrid>
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

      setFolders((folder) => [...folder, { ...response.data, items: [] }]);

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
