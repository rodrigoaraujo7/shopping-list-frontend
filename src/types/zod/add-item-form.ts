import { z } from "zod";

export const AddItemFormSchema = z.object({
  name: z.string().min(1, { message: "Nome do item é obrigatório" }),
  link: z.string(),
  // quantity: z.number(),
});

export type AddItemFormData = z.infer<typeof AddItemFormSchema>;
