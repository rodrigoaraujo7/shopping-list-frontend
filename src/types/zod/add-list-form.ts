import { z } from "zod";

export const AddListFormSchema = z.object({
  id: z.string().min(1, { message: "O ID é obrigatório para criar uma lista" }),
});

export type AddListFormData = z.infer<typeof AddListFormSchema>;
