export interface Folder {
  id: string;
  title: string;
  description?: string;
  items: Item[];
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  checked: boolean;
  folderId: string;
  created_at: string;
  updated_at: string;
}
