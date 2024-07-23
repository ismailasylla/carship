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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "year" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const carData: Car = {
      _id: "",
      make: form.make,
      model: form.model,
      year: form.year,
      currency: form.currency,
      price: form.price,
      shippingStatus: form.shippingStatus,
      createdAt: "",
      updatedAt: "",
      __v: 0,
      vin: "",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Add New Car
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="make" className="block text-gray-600 mb-1">
              Make
            </label>
            <input
              name="make"
              value={form.make}
              onChange={handleChange}
              placeholder="Make"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-gray-600 mb-1">
              Model
            </label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Model"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-gray-600 mb-1">
              Year
            </label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              type="number"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-gray-600 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AED">AED</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              {/* Add more currency options as needed */}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-600 mb-1">
              Price
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="shippingStatus"
              className="block text-gray-600 mb-1"
            >
              Shipping Status
            </label>
            <select
              name="shippingStatus"
              value={form.shippingStatus}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-customGray text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
