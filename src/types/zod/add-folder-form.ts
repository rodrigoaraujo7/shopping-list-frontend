import { z } from "zod";

export const AddFolderFormSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  description: z.string(),
});

export type AddFolderFormData = z.infer<typeof AddFolderFormSchema>;
