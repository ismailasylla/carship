import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addCar } from "../store/slices/carSlice";
import { Car } from "../types";

const CarForm: React.FC = () => {
  const [form, setForm] = useState<{
    make: string;
    model: string;
    year: number;
    currency: string;
    price: number;
    shippingStatus: string;
  }>({
    make: "",
    model: "",
    year: 0,
    currency: "AED",
    price: 0,
    shippingStatus: "pending",
  });

  const dispatch: AppDispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "year" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const carData: Car = {
      id: "",
      name: form.make,
      brand: form.model,
      year: form.year,
      currency: form.currency,
      price: form.price,
      shippingStatus: form.shippingStatus,
      model: "",
      make: "",
    };

    dispatch(addCar(carData));
    setForm({
      make: "",
      model: "",
      year: 0,
      currency: "AED",
      price: 0,
      shippingStatus: "pending",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="make"
        value={form.make}
        onChange={handleChange}
        placeholder="Make"
        required
      />
      <input
        name="model"
        value={form.model}
        onChange={handleChange}
        placeholder="Model"
        required
      />
      <input
        name="year"
        value={form.year}
        onChange={handleChange}
        placeholder="Year"
        type="number"
        required
      />
      <input
        name="currency"
        value={form.currency}
        onChange={handleChange}
        placeholder="Currency"
        required
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        type="number"
        required
      />
      <input
        name="shippingStatus"
        value={form.shippingStatus}
        onChange={handleChange}
        placeholder="Shipping Status"
        required
      />
      <button type="submit">Add Car</button>
    </form>
  );
};

export default CarForm;
