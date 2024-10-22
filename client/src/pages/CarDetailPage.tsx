import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { Car } from "../types";
import { getCar, updateCar, deleteCar } from "../store/slices/carSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../components/buttons/BackButton";

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Access car and auth state
  const car = useSelector((state: RootState) => state.car.currentCar);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState<Car | null>(car);

  useEffect(() => {
    if (id) {
      dispatch(getCar(id)).then(() => {
        console.log("Car fetched:", car);
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    console.log("Setting form:", car);
    setForm(car);
  }, [car]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => (prevForm ? { ...prevForm, [name]: value } : null));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in to update a car.");
      return;
    }
    if (form) {
      try {
        await dispatch(updateCar(form)).unwrap();
        toast.success("Car details updated successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        toast.error("Failed to update car. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete a car.");
      return;
    }
    if (id) {
      try {
        await dispatch(deleteCar(id)).unwrap();
        toast.success("Car deleted successfully!");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        toast.error("Failed to delete car. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto">
        <BackButton />
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Car Details
        </h1>
        {form ? (
          <form
            onSubmit={handleUpdate}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="make">
                Make
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={form.make}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="model">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="year">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                {/* Add more currency options if needed */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form?.price || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="shippingStatus"
              >
                Shipping Status
              </label>
              <select
                id="shippingStatus"
                name="shippingStatus"
                value={form.shippingStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                {/* Add more statuses if needed */}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Update Car
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Delete Car
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-500 text-center text-xl">Loading...</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CarDetailPage;
