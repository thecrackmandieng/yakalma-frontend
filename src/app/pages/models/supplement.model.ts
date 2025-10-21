export interface Supplement {
  name: string;
  price: number;
}

export interface MenuItemWithSupplements {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  supplements?: Supplement[];
}
