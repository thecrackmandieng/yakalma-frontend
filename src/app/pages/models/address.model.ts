export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryAddress extends Address {
  id?: string;
  label?: string;
  isDefault?: boolean;
  clientId?: string;
  createdAt?: Date;
}
