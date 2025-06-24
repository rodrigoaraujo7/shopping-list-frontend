import React, { useState } from "react";

import { useNavigate, useParams } from "react-router";

import { AnimatePresence, motion } from "motion/react";

import { MainGrid } from "../components/MainGrid";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { EditFolderModal } from "../components/modals/EditFolderModal";
import { FolderItem } from "../components/FolderItem";
import { InputSearch } from "../components/InputSearch";
import { AddItemModal } from "../components/modals/AddItemModal";
import { DeleteFolderModal } from "../components/modals/DeleteFolderModal";
import { EmptyContent } from "../components/EmptyContent";
import { LoadingPage } from "../components/LoadingPage";

import { RxArrowLeft, RxListBullet, RxPencil1, RxTrash } from "react-icons/rx";

import noFolderRoute from "../assets/svg/no-folder-route.svg";
import noItems from "../assets/svg/no-items.svg";
import noFilterData from "../assets/svg/no-filterData.svg";

import { blurTextAnimation } from "../animations/blurTextAnimation";
import { listItemAnimation } from "../animations/listItemAnimation";

import { useFolderContext } from "../context/FolderContext";

import { normalizeText } from "../util/normalizeText";

import type { Folder, Item } from "../types/List";

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

  const { listId, folders, loading } = useFolderContext();
  const { folderId } = useParams();

  const folder: Folder | undefined = folders.find(
    (item) => item.id === folderId
  );

  const filteredItems: Item[] =
    searchItemValue.length > 0
      ? folder?.items?.filter((item) =>
          normalizeText(item.name).includes(normalizeText(searchItemValue))
        ) ?? []
      : [];

  const navigate = useNavigate();

  const handleModalChange = (modalType: keyof typeof modal, value: boolean) => {
    setModal((prev) => ({ ...prev, [modalType]: value }));
  };

  if (loading) return <LoadingPage />;

  return (
    <MainGrid>
      {folder ? (
        <div className="flex flex-col gap-4 h-full">
          <header className="flex justify-between gap-4">
            <Avatar
              onClick={() => navigate(`../${listId}`)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0 }}
            >
              <RxArrowLeft color="#7f56d9" size={16} strokeWidth=".75" />
            </Avatar>

            <div className="flex gap-4">
              <Avatar
                onClick={() => handleModalChange("edit", true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <RxPencil1 color="#7f56d9" size={16} strokeWidth=".75" />
              </Avatar>
              <Avatar
                onClick={() => handleModalChange("delete", true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <RxTrash color="#7f56d9" size={16} strokeWidth=".75" />
              </Avatar>
            </div>
          </header>

          <motion.h1
            className="font-bold text-2xl text-gray-700"
            variants={blurTextAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {folder.title}
          </motion.h1>

          {folder.description && (
            <motion.h2
              className="font-medium text-sm text-gray-500"
              variants={blurTextAnimation}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {folder.description}
            </motion.h2>
          )}

          <motion.div
            className="flex items-center gap-1"
            variants={blurTextAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <RxListBullet color="#667085" />
            <span className="font-normal text-sm text-gray-500">
              {folder.items.filter((item) => item.checked).length}/
              {folder.items.length} itens completos
            </span>
          </motion.div>

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
                  <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto overflow-x-hidden">
                    {filteredItems.map((item) => (
                      <FolderItem item={item} key={item.id} />
                    ))}
                  </div>

                  <Button onClick={() => handleModalChange("addItem", true)}>
                    Adicionar novo item
                  </Button>
                </React.Fragment>
              ) : (
                <EmptyContent
                  image={noFilterData}
                  title="Item não encontrado"
                  subTitle="O item que você está buscando não existe"
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {folder.items.length >= 1 ? (
                <React.Fragment>
                  <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto overflow-x-hidden">
                    {folder.items.map((item, index) => (
                      <FolderItem
                        item={item}
                        key={item.id}
                        custom={index}
                        variants={listItemAnimation}
                        initial="hidden"
                        animate="visible"
                      />
                    ))}
                  </div>

                  <Button onClick={() => handleModalChange("addItem", true)}>
                    Adicionar novo item
                  </Button>
                </React.Fragment>
              ) : (
                <EmptyContent
                  image={noItems}
                  title="Adicione items para sua lista"
                  subTitle="Sua lista de compras inteligente será exibida aqui. Comece criando um novo item"
                  buttonContent="Adicionar novo item"
                  onClick={() => handleModalChange("addItem", true)}
                />
              )}
            </React.Fragment>
          )}
        </div>
      ) : (
        <EmptyContent
          image={noFolderRoute}
          title="Pasta não encontrada"
          subTitle="Parece que a pasta que você está tentando acessar não existe, retorne à página inicial e tente novamente"
          buttonContent="Voltar"
          onClick={() => navigate("../")}
        />
      )}

      <AnimatePresence mode="wait">
        {modal.addItem && (
          <AddItemModal onClose={() => handleModalChange("addItem", false)} />
        )}

        {modal.edit && (
          <EditFolderModal
            folder={folder}
            onClose={() => handleModalChange("edit", false)}
          />
        )}

        {modal.delete && (
          <DeleteFolderModal
            onClose={() => handleModalChange("delete", false)}
          />
        )}
      </AnimatePresence>
    </MainGrid>
  );
};
