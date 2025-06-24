import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { useNavigate, useParams } from "react-router";

import { LoadingPage } from "../components/LoadingPage";
import { Card } from "../components/Card";
import { useFolderContext } from "../context/FolderContext";
import { Avatar } from "../components/Avatar";
import { MainGrid } from "../components/MainGrid";
import { InputSearch } from "../components/InputSearch";
import { AddFolderModal } from "../components/modals/AddFolderModal";
import { EmptyContent } from "../components/EmptyContent";

import { filteredListItemAnimation } from "../animations/filteredListItemAnimation";
import { listItemAnimation } from "../animations/listItemAnimation";
import { blurTextListAnimation } from "../animations/blurTextAnimation";

import noData from "../assets/svg/no-data.svg";
import noFilterData from "../assets/svg/no-filterData.svg";

import { RxListBullet, RxPlus } from "react-icons/rx";

import { normalizeText } from "../util/normalizeText";

import { api } from "../services/api";

import type { Folder } from "../types/Folder";

export const ListPage = () => {
  const [addFolderModal, setAddFolderModal] = useState<boolean>(false);
  const [searchFolderValue, setSearchFolderValue] = useState<string>("");

  const { setListId, folders, setFolders, loading, setLoading } =
    useFolderContext();

  const { listId } = useParams();

  const fetchFolders = async () => {
    if (!listId) return;

    setListId(listId);

    try {
      const { data } = await api.get("/folders", {
        params: {
          listId,
        },
      });

      setFolders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filteredFolders: Folder[] =
    searchFolderValue.length > 0
      ? folders.filter((folder) =>
          normalizeText(folder.title).includes(normalizeText(searchFolderValue))
        )
      : [];

  const navigate = useNavigate();

  if (loading) return <LoadingPage />;

  return (
    <MainGrid>
      {folders.length <= 0 ? (
        <EmptyContent
          image={noData}
          title="Comece criando uma pasta"
          subTitle="Sua lista de compras inteligente será exibida aqui. Comece criando uma nova pasta"
          buttonContent="Adicionar nova pasta"
          onClick={() => setAddFolderModal(true)}
        />
      ) : (
        <div className="h-full flex flex-col gap-4">
          <InputSearch
            state={searchFolderValue}
            setState={setSearchFolderValue}
            placeholder="Buscar pelo nome da pasta"
          />

          <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto overflow-x-hidden">
            {searchFolderValue.length > 0 ? (
              <React.Fragment>
                {filteredFolders.length > 0 ? (
                  <React.Fragment>
                    {filteredFolders.map((folder, index) => (
                      <Card
                        key={folder.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`./${folder.id}`)}
                        custom={index}
                        variants={filteredListItemAnimation}
                        initial="hidden"
                        animate="visible"
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
                            {folder.items.filter((item) => item.checked).length}
                            /{folder.items.length} itens completos
                          </span>
                        </div>
                      </Card>
                    ))}
                  </React.Fragment>
                ) : (
                  <EmptyContent
                    image={noFilterData}
                    title="Pasta não encontrada"
                    subTitle="A pasta que você está buscando não existe"
                  />
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {folders.map((folder, index) => (
                  <Card
                    key={folder.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`./${folder.id}`)}
                    custom={index}
                    variants={listItemAnimation}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h1
                      className="font-bold text-lg text-gray-700"
                      custom={index}
                      variants={blurTextListAnimation}
                      initial="hidden"
                      animate="visible"
                    >
                      {folder.title}
                    </motion.h1>

                    {folder.description && (
                      <motion.h2
                        className="font-normal text-sm text-gray-500"
                        custom={index}
                        variants={blurTextListAnimation}
                        initial="hidden"
                        animate="visible"
                      >
                        {folder.description}
                      </motion.h2>
                    )}

                    <motion.div
                      className="flex items-center gap-1"
                      custom={index}
                      variants={blurTextListAnimation}
                      initial="hidden"
                      animate="visible"
                    >
                      <RxListBullet color="#667085" />
                      <span className="font-normal text-sm text-gray-500">
                        {folder.items.filter((item) => item.checked).length}/
                        {folder.items.length} itens completos
                      </span>
                    </motion.div>
                  </Card>
                ))}
              </React.Fragment>
            )}
          </div>
        </div>
      )}

      {folders.length >= 1 && (
        <Avatar
          style={{
            position: "fixed",
            right: 16,
            bottom: 32,
            padding: 16,
          }}
          onClick={() => setAddFolderModal(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <RxPlus color="#7f56d9" size={24} />
        </Avatar>
      )}

      <AnimatePresence mode="wait">
        {addFolderModal && (
          <AddFolderModal onClose={() => setAddFolderModal(false)} />
        )}
      </AnimatePresence>
    </MainGrid>
  );
};
