import React, { useState } from "react";

import { AnimatePresence } from "motion/react";

import { useNavigate } from "react-router";

import { Card } from "../components/Card";
import { useFolderContext } from "../context/FolderContext";
import { Button } from "../components/Button";
import { Avatar } from "../components/Avatar";
import { MainGrid } from "../components/MainGrid";
import { InputSearch } from "../components/InputSearch";
import { AddFolderModal } from "../components/modals/AddFolderModal";

import noData from "../assets/svg/no-data.svg";
import noFilterData from "../assets/svg/no-filterData.svg";

import { RxListBullet, RxPlus } from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import { normalizeText } from "../util/normalizeText";

import type { Folder } from "../types/Folder";

export const App = () => {
  const [addFolderModal, setAddFolderModal] = useState<boolean>(false);
  const [searchFolderValue, setSearchFolderValue] = useState<string>("");

  const { folders, loading } = useFolderContext();

  const filteredFolders: Folder[] =
    searchFolderValue.length > 0
      ? folders.filter((folder) =>
          normalizeText(folder.title).includes(normalizeText(searchFolderValue))
        )
      : [];

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
            <div className="h-full flex flex-col gap-4">
              <InputSearch
                state={searchFolderValue}
                setState={setSearchFolderValue}
                placeholder="Buscar pelo nome da pasta"
              />

              <div className="flex flex-col gap-3 flex-[1] pr-1 overflow-auto">
                {searchFolderValue.length > 0 ? (
                  <React.Fragment>
                    {filteredFolders.length > 0 ? (
                      <React.Fragment>
                        {filteredFolders.map((folder) => (
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
                                {
                                  folder.items.filter((item) => item.checked)
                                    .length
                                }
                                /{folder.items.length} itens completos
                              </span>
                            </div>
                          </Card>
                        ))}
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
                            {folder.items.filter((item) => item.checked).length}
                            /{folder.items.length} itens completos
                          </span>
                        </div>
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
            >
              <RxPlus color="#7f56d9" size={24} />
            </Avatar>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        {addFolderModal && (
          <AddFolderModal onClose={() => setAddFolderModal(false)} />
        )}
      </AnimatePresence>
    </MainGrid>
  );
};
