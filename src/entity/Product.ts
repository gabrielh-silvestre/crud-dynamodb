export type IProduct = {
  id: string;

  name: string;
  description: string;
  image: string;
  price: number;
  availableQuantity: number;

  createdAt: string;
  updatedAt: string;
};

export type ProductCreateDto = {
  name: string;
  description: string;
  image?: string;
  availableQuantity: number;
  price: number;
};
