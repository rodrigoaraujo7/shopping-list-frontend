import { useState } from "react";

import { toast } from "react-toastify";

import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type AddFolderFormData,
  AddFolderFormSchema,
} from "../../types/zod/add-folder-form";

import { useFolderContext } from "../../context/FolderContext";

import { api } from "../../services/api";

export const AddFolderModal = ({ onClose }: { onClose: () => void }) => {
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
      toast.success("Pasta criada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar pasta!");
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
