import { useState } from "react";

import { Button } from "../Button";
import { Modal } from "../Modal";
import { Input } from "../Input";

import { useForm } from "react-hook-form";
import {
  AddFolderFormSchema,
  type AddFolderFormData,
} from "../../types/zod/add-folder-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFolderContext } from "../../context/FolderContext";

import { api } from "../../services/api";

import type { Folder } from "../../types/Folder";

export const EditFolderModal = ({
  onClose,
  folder,
}: {
  onClose: () => void;
  folder: Folder | undefined;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFolderFormData>({
    resolver: zodResolver(AddFolderFormSchema),
    defaultValues: {
      title: folder?.title,
      description: folder?.description,
    },
  });

  const onSubmit = async (data: AddFolderFormData) => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const response = await api.put<Folder>(
        "/folder",
        {
          title: data.title,
          description: data.description,
        },
        {
          params: {
            id: folder?.id,
          },
        }
      );

      setFolders((prev) =>
        prev.map((f) =>
          f.id === response.data.id
            ? {
                ...f,
                title: response.data.title,
                description: response.data.description,
              }
            : f
        )
      );

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal title="Editar pasta" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome da pasta"
          placeholder="-"
          {...register("title")}
          defaultValue={folder?.title}
          styles={errors.title && "error"}
        />

        <Input
          id="description"
          label="Descrição da pasta"
          placeholder="-"
          {...register("description")}
          defaultValue={folder?.description}
        />

        <Button isFetching={isFetching}>Atualizar</Button>
      </form>
    </Modal>
  );
};
