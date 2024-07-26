import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addCar } from "../store/slices/carSlice";
import { Car } from "../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
import { BackButton, Button } from "./buttons";
import socket from "../socket/websocket";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { carValidationSchema } from "../validation/validationSchemas";

const AddCarForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // const navigate = useNavigate()

  const handleSubmit = async (values: {
    make: string;
    model: string;
    year: number;
    currency: string;
    price: number;
    shippingStatus: string;
    vin: string;
  }) => {
    const carData: Car = {
      _id: "",
      make: values.make,
      model: values.model,
      year: values.year,
      currency: values.currency,
      price: values.price,
      shippingStatus: values.shippingStatus,
      vin: values.vin,
      createdAt: "",
      updatedAt: "",
      __v: 0,
      imageUrl: "",
    };

    try {
      await dispatch(addCar(carData)).unwrap();
      toast.success("Car details added successfully!");

      // Emit WebSocket event
      socket.emit("carAdded", carData);

      // navigate("/");
      setTimeout(() => {
        window.location.href = "/";
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
          <Formik
            initialValues={{
              make: "",
              model: "",
              year: 0,
              currency: "AED",
              price: 0,
              shippingStatus: "Pending",
              vin: "",
            }}
            validationSchema={carValidationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="make" className="block text-gray-600 mb-1">
                    Make
                  </label>
                  <Field
                    name="make"
                    placeholder="Make"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="make"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-gray-600 mb-1">
                    Model
                  </label>
                  <Field
                    name="model"
                    placeholder="Model"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="model"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-gray-600 mb-1">
                    Year
                  </label>
                  <Field
                    name="year"
                    type="number"
                    placeholder="Year"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="year"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-gray-600 mb-1"
                  >
                    Currency
                  </label>
                  <Field
                    as="select"
                    name="currency"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AED">AED</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Field>
                </div>
                <div>
                  <label htmlFor="price" className="block text-gray-600 mb-1">
                    Price
                  </label>
                  <Field
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="price"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="vin" className="block text-gray-600 mb-1">
                    VIN
                  </label>
                  <Field
                    name="vin"
                    placeholder="VIN"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="vin"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingStatus"
                    className="block text-gray-600 mb-1"
                  >
                    Shipping Status
                  </label>
                  <Field
                    as="select"
                    name="shippingStatus"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Field>
                </div>
                <Button type="submit">Add Car</Button>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddCarForm;
