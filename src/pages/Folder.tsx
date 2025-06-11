import React, { useState } from "react";

import { useNavigate, useParams } from "react-router";

import { AnimatePresence } from "motion/react";

import { MainGrid } from "../components/MainGrid";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";

import {
  RxArrowLeft,
  RxListBullet,
  RxExternalLink,
  RxPencil1,
  RxTrash,
} from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import { useForm } from "react-hook-form";
import {
  AddItemFormSchema,
  type AddItemFormData,
} from "../types/zod/add-item-form";
import { zodResolver } from "@hookform/resolvers/zod";

import noFolderRoute from "../assets/svg/no-folder-route.svg";
import noItems from "../assets/svg/no-items.svg";
import deleteFolder from "../assets/svg/delete-folder.svg";
import deleteItem from "../assets/svg/delete-item.svg";

import { useFolderContext } from "../context/FolderContext";

import { api } from "../services/api";

import type { Folder, Item } from "../types/Folder";

export const FolderPage = () => {
  const [addItemModal, setAddItemModal] = useState<boolean>(false);
  const [editItemModal, setEditItemModal] = useState<boolean>(false);
  const [deleteItemModal, setDeleteItemModal] = useState<boolean>(false);
  const [deleteFolderModal, setDeleteFolderModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();

  const { folders, setFolders, loading } = useFolderContext();
  const { folderId } = useParams();

  const folder: Folder | undefined = folders.find(
    (item) => item.id === folderId
  );

  const navigate = useNavigate();

  const handleCheckItemList = async (item: Item) => {
    try {
      const updatedItem = {
        ...item,
        checked: !item.checked,
      };

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.map((i) =>
                  i.id === item.id ? updatedItem : i
                ),
              }
            : folder
        )
      );

      await api.put(`item`, updatedItem, {
        params: { id: item.id },
      });
    } catch (error) {
      console.log(error);
    }
  };

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
                <Avatar onClick={() => setDeleteFolderModal(true)}>
                  <RxTrash color="#7f56d9" size={16} strokeWidth=".75" />
                </Avatar>
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

              {folder.items.length >= 1 ? (
                <React.Fragment>
                  <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto">
                    {folder.items.map((item) => (
                      <Card
                        styles={item.checked ? "colored" : "soft"}
                        key={item.id}
                        data-checked={item.checked}
                      >
                        <div className="flex gap-2 items-center justify-between w-full">
                          <div className="flex items-center gap-2 relative w-[68%] md:w-[88%]">
                            <input
                              type="checkbox"
                              id={`checkbox-${item.id}`}
                              checked={item.checked}
                              onChange={() => handleCheckItemList(item)}
                              className=" relative peer shrink-0 appearance-none w-4 h-4 border-[1px] border-gray-300 rounded-sm bg-white checked:bg-primary-50 checked:border-primary-600 transition-[.15s]"
                            />
                            <label
                              htmlFor={`checkbox-${item.id}`}
                              className={`font-normal text-sm text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap transition-[.15s] ${
                                item.checked
                                  ? "line-through text-primary-600"
                                  : ""
                              }`}
                            >
                              {item.name}
                            </label>
                            <svg
                              className="absolute w-3 h-3 ml-[2px] hidden peer-checked:block pointer-events-none"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#7f56d9"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>

                          <div className="flex gap-2">
                            {item.link && (
                              <a href={item.link} target="_blank">
                                <RxExternalLink
                                  size={16}
                                  strokeWidth=".5"
                                  color={item.checked ? "#7f56d9" : "#667085"}
                                />
                              </a>
                            )}

                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedItem(item);
                                setEditItemModal(true);
                              }}
                            >
                              <RxPencil1
                                size={16}
                                strokeWidth=".5"
                                color={item.checked ? "#7f56d9" : "#667085"}
                              />
                            </span>

                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedItem(item);
                                setDeleteItemModal(true);
                              }}
                            >
                              <RxTrash
                                size={16}
                                strokeWidth=".5"
                                color={item.checked ? "#7f56d9" : "#667085"}
                              />
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button onClick={() => setAddItemModal(true)}>
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

                    <Button onClick={() => setAddItemModal(true)}>
                      Adicionar novo item
                    </Button>
                  </div>
                </div>
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
        {addItemModal && <AddItemForm onClose={() => setAddItemModal(false)} />}

        {editItemModal && (
          <EditItemForm
            onClose={() => setEditItemModal(false)}
            selectedItem={selectedItem}
          />
        )}

        {deleteItemModal && (
          <DeleteItemForm
            onClose={() => setDeleteItemModal(false)}
            selectedItem={selectedItem}
          />
        )}

        {deleteFolderModal && (
          <DeleteFolderForm onClose={() => setDeleteFolderModal(false)} />
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

const EditItemForm = ({
  onClose,
  selectedItem,
}: {
  onClose: () => void;
  selectedItem: Item | undefined;
}) => {
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

      const response = await api.put(
        "/item",
        {
          ...selectedItem,
          name: data.name,
          link: data.link,
        },
        {
          params: {
            id: selectedItem?.id,
          },
        }
      );

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.map((i) =>
                  i.id === selectedItem?.id ? response.data : i
                ),
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
    <Modal title="Atualizar item" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome do item"
          placeholder="-"
          {...register("name")}
          defaultValue={selectedItem?.name}
          styles={errors.name && "error"}
        />

        <Input
          id="link"
          label="Link"
          placeholder="-"
          {...register("link")}
          defaultValue={selectedItem?.link}
        />

        <Button isFetching={isFetching}>Salvar</Button>
      </form>
    </Modal>
  );
};

const DeleteItemForm = ({
  onClose,
  selectedItem,
}: {
  onClose: () => void;
  selectedItem: Item | undefined;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const handleDelete = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      await api.delete("/item", {
        params: {
          id: selectedItem?.id,
        },
      });

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.filter((i) => i.id !== selectedItem?.id),
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
    <Modal title="Deletar item" onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[360px]">
          <img src={deleteItem} alt="" width={300} />

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Essa ação é irreversível
            </h1>
            <h2 className="text-sm font-medium text-gray-500">
              Tem certeza que deseja deletar esse item?
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
