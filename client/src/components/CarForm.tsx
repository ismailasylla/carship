import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addCar } from "../store/slices/carSlice";
import { Car } from "../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const CarForm: React.FC = () => {
  const [form, setForm] = useState<{
    make: string;
    model: string;
    year: number;
    currency: string;
    price: number;
    shippingStatus: string;
    vin: string;
  }>({
    make: "",
    model: "",
    year: 0,
    currency: "AED",
    price: 0,
    shippingStatus: "Pending",
    vin: "",
  });

  const [errors, setErrors] = useState<{
    make?: string;
    model?: string;
    year?: string;
    price?: string;
    vin?: string;
  }>({});

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let errors: any = {};

    if (!form.make) {
      errors.make = "Make is required";
      valid = false;
    }
    if (!form.model) {
      errors.model = "Model is required";
      valid = false;
    }
    if (form.year <= 0 || form.year > new Date().getFullYear()) {
      errors.year = "Year must be a valid year";
      valid = false;
    }
    if (form.price <= 0) {
      errors.price = "Price must be a positive number";
      valid = false;
    }
    if (!form.vin) {
      errors.vin = "VIN is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "year" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const carData: Car = {
      _id: "",
      make: form.make,
      model: form.model,
      year: form.year,
      currency: form.currency,
      price: form.price,
      shippingStatus: form.shippingStatus,
      vin: form.vin,
      createdAt: "",
      updatedAt: "",
      __v: 0,
    };

    try {
      await dispatch(addCar(carData)).unwrap();
      toast.success("Car details added successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to homepage after a short delay
      }, 2000);
    } catch (error) {
      console.error("Failed to add car:", error);
      toast.error("Failed to add car. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Add New Car
        </h1>
        <div className="mt-6">
          {" "}
          {/* Added margin-top to the form container */}
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
              {errors.make && (
                <p className="text-red-500 text-sm">{errors.make}</p>
              )}
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
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model}</p>
              )}
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
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year}</p>
              )}
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
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="vin" className="block text-gray-600 mb-1">
                VIN
              </label>
              <input
                name="vin"
                value={form.vin}
                onChange={handleChange}
                placeholder="VIN"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.vin && (
                <p className="text-red-500 text-sm">{errors.vin}</p>
              )}
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
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-customGray text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Car
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CarForm;
