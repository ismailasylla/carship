import { ReactNode } from "react";

export interface Car {
    id: string;
    model: ReactNode;
    make: string;
    name: string;
    brand: string;
    currency: string;
    price: number;
    year: number;
    status: string;
  }