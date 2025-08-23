export interface ICategory {
  id: number;
  name: string;
  parentId?: number | null;
  slug?: string;
  imageUrl?: string;
}

export interface ICreateCategory {
  name: string;
  parentId?: number | null;
  slug: string;
  imageUrl: string;
}
