import { useState } from "react";

import { Card } from "../components/Card";
import { MainGrid } from "../components/MainGrid";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { motion } from "motion/react";
import { blurTextAnimation } from "../animations/blurTextAnimation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AddListFormSchema,
  type AddListFormData,
} from "../types/zod/add-list-form";

import { useListContext } from "../context/ListContext";

import { api } from "../services/api";

import { useNavigate } from "react-router";

import { toast } from "react-toastify";

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { avaliableListIds } = useListContext();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddListFormData>({
    resolver: zodResolver(AddListFormSchema),
  });

  const onSubmit = async (data: AddListFormData) => {
    if (isFetching) return;

    if (avaliableListIds.includes(data.id)) {
      navigate(`/${data.id}`);
      return toast.success("Lista acessada com sucesso!");
    }

    try {
      setIsFetching(true);

      await api.post("/list", {
        id: data.id,
      });

      navigate(`/${data.id}`);
      toast.success("Lista criada com sucesso!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <MainGrid>
      <motion.div
        className="flex justify-center items-center h-full"
        variants={blurTextAnimation}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card styles="outline" flex="center" style={{ width: "460px" }}>
          <img src={"/logo.png"} alt="tanalista-logo" width={300} />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full"
          >
            <Input
              id="id"
              label="ID da sua lista"
              placeholder="Exemplo: minha-lista"
              {...register("id")}
              styles={errors.id && "error"}
              onChange={(e) => {
                const cleaned = e.target.value.toLowerCase().replace(/\s/g, "");
                setValue("id", cleaned);
              }}
            />

            <Button isFetching={isFetching}>Criar ou acessar lista</Button>
          </form>
        </Card>
      </motion.div>
    </MainGrid>
  );
};
