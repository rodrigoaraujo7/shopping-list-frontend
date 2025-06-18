import React, { useState } from "react";

import { useNavigate, useParams } from "react-router";

import { AnimatePresence } from "motion/react";

import { MainGrid } from "../components/MainGrid";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { FolderItem } from "../components/FolderItem";
import { InputSearch } from "../components/InputSearch";

import { RxArrowLeft, RxListBullet, RxPencil1, RxTrash } from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import { useForm } from "react-hook-form";
import {
  AddItemFormSchema,
  type AddItemFormData,
} from "../types/zod/add-item-form";
import {
  AddFolderFormSchema,
  type AddFolderFormData,
} from "../types/zod/add-folder-form";
import { zodResolver } from "@hookform/resolvers/zod";

import noFolderRoute from "../assets/svg/no-folder-route.svg";
import noItems from "../assets/svg/no-items.svg";
import deleteFolder from "../assets/svg/delete-folder.svg";
import noFilterData from "../assets/svg/no-filterData.svg";

import { useFolderContext } from "../context/FolderContext";

import { api } from "../services/api";

import type { Folder, Item } from "../types/Folder";

export const FolderPage = () => {
  const [modal, setModal] = useState<{
    addItem: boolean;
    edit: boolean;
    delete: boolean;
  }>({
    addItem: false,
    edit: false,
    delete: false,
  });
  const [searchItemValue, setSearchItemValue] = useState<string>("");

  const { folders, loading } = useFolderContext();
  const { folderId } = useParams();

  const folder: Folder | undefined = folders.find(
    (item) => item.id === folderId
  );

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredItems: Item[] =
    searchItemValue.length > 0
      ? folder?.items?.filter((item) =>
          normalizeText(item.name).includes(normalizeText(searchItemValue))
        ) ?? []
      : [];

  const navigate = useNavigate();

  return (
    <MainGrid>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CgSpinner className="animate-spin" size={75} color="#7f56d9" />
        </div>
      ) : (
        <React.Fragment>
          {folder ? (
            <div className="flex flex-col gap-4 h-full">
              <header className="flex justify-between gap-4">
                <Avatar onClick={() => navigate("../")}>
                  <RxArrowLeft color="#7f56d9" size={16} strokeWidth=".75" />
                </Avatar>

                <div className="flex gap-4">
                  <Avatar
                    onClick={() =>
                      setModal((prev) => ({ ...prev, edit: true }))
                    }
                  >
                    <RxPencil1 color="#7f56d9" size={16} strokeWidth=".75" />
                  </Avatar>
                  <Avatar
                    onClick={() =>
                      setModal((prev) => ({ ...prev, delete: true }))
                    }
                  >
                    <RxTrash color="#7f56d9" size={16} strokeWidth=".75" />
                  </Avatar>
                </div>
              </header>

              <h1 className="font-bold text-2xl text-gray-700">
                {folder.title}
              </h1>

              {folder.description && (
                <h2 className="font-medium text-sm text-gray-500">
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

              {folder.items.length > 0 && (
                <InputSearch
                  state={searchItemValue}
                  setState={setSearchItemValue}
                  placeholder="Buscar pelo nome do item"
                />
              )}

              {searchItemValue.length > 0 ? (
                <React.Fragment>
                  {filteredItems.length > 0 ? (
                    <React.Fragment>
                      <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto">
                        {filteredItems.map((item) => (
                          <FolderItem item={item} key={item.id} />
                        ))}
                      </div>

                      <Button
                        onClick={() =>
                          setModal((prev) => ({ ...prev, addItem: true }))
                        }
                      >
                        Adicionar novo item
                      </Button>
                    </React.Fragment>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <Card
                        styles="outline"
                        flex="center"
                        style={{ width: "360px" }}
                      >
                        <img src={noFilterData} alt="no-data" width={300} />

                        <div className="text-center">
                          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Pasta não encontrada
                          </h1>
                          <h2 className="text-sm font-medium text-gray-500">
                            A pasta que você está buscando não existe
                          </h2>
                        </div>
                      </Card>
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {folder.items.length >= 1 ? (
                    <React.Fragment>
                      <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto">
                        {folder.items.map((item) => (
                          <FolderItem item={item} key={item.id} />
                        ))}
                      </div>

                      <Button
                        onClick={() =>
                          setModal((prev) => ({ ...prev, addItem: true }))
                        }
                      >
                        Adicionar novo item
                      </Button>
                    </React.Fragment>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="flex flex-col gap-4 w-[360px]">
                        <img src={noItems} alt="" width={300} />

                        <div className="text-center">
                          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Adicione items para sua lista
                          </h1>
                          <h2 className="text-sm font-medium text-gray-500">
                            Sua lista de compras inteligente será exibida aqui.
                            Comece criando um novo item
                          </h2>
                        </div>

                        <Button
                          onClick={() =>
                            setModal((prev) => ({ ...prev, addItem: true }))
                          }
                        >
                          Adicionar novo item
                        </Button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Card styles="outline" flex="center" style={{ width: "360px" }}>
                <img src={noFolderRoute} alt="" width={300} />

                <div className="text-center">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Pasta não encontrada
                  </h1>
                  <h2 className="text-sm font-medium text-gray-500">
                    Parece que a pasta que você está tentando acessar não
                    existe, retorne à página inicial e tente novamente
                  </h2>
                </div>

                <Button onClick={() => navigate("../")}>Voltar</Button>
              </Card>
            </div>
          )}
        </React.Fragment>
      )}

      <AnimatePresence mode="wait">
        {modal.addItem && (
          <AddItemForm
            onClose={() => setModal((prev) => ({ ...prev, addItem: false }))}
          />
        )}

        {modal.edit && (
          <EditFolderForm
            folder={folder}
            onClose={() => setModal((prev) => ({ ...prev, edit: false }))}
          />
        )}

        {modal.delete && (
          <DeleteFolderForm
            onClose={() => setModal((prev) => ({ ...prev, delete: false }))}
          />
        )}
      </AnimatePresence>
    </MainGrid>
  );
};

const AddItemForm = ({ onClose }: { onClose: () => void }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(AddItemFormSchema),
  });

  const onSubmit = async (data: AddItemFormData) => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const response = await api.post("/item", {
        name: data.name,
        link: data.link,
        folderId,
      });

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: [...folder.items, response.data],
              }
            : folder
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
    <Modal title="Adicionar novo item" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome do item"
          placeholder="-"
          {...register("name")}
          styles={errors.name && "error"}
        />

        <Input id="link" label="Link" placeholder="-" {...register("link")} />

        <Button isFetching={isFetching}>Criar</Button>
      </form>
    </Modal>
  );
};

const EditFolderForm = ({
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

const DeleteFolderForm = ({ onClose }: { onClose: () => void }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const navigate = useNavigate();
  const { folderId } = useParams();

  const handleDelete = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      await api.delete("/folder", {
        params: {
          id: folderId,
        },
      });

      setFolders((prevFolders) =>
        prevFolders.filter((pv) => pv.id !== folderId)
      );

      navigate("../");
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal title="Deletar pasta" onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[360px]">
          <img src={deleteFolder} alt="" width={300} />

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Essa ação é irreversível
            </h1>
            <h2 className="text-sm font-medium text-gray-500">
              Tem certeza que deseja deletar essa pasta?
            </h2>
          </div>

          <Button isFetching={isFetching} onClick={handleDelete}>
            Deletar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
