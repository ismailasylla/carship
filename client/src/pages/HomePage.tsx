import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars, updateCars, addCar } from "../store/slices/carSlice";
import CarList from "../components/CarList";
import socket from "../utils/websocket";
import { Car } from "../types";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, status, error } = useSelector((state: RootState) => state.car);

  useEffect(() => {
    const page = 1;
    const model = "";
    const year = "";
    const make = "";

    // Fetch cars
    dispatch(fetchCars({ page, model, year, make })).then((action) => {
      if (fetchCars.fulfilled.match(action)) {
        console.log("Fetched cars:", action.payload);
      } else {
        console.error("Failed to fetch cars");
      }
    });

    // Handle WebSocket events
    const handleCarUpdate = (updatedCars: Car[]) => {
      dispatch(updateCars(updatedCars));
    };

    const handleCarAdd = (newCar: Car) => {
      dispatch(addCar(newCar));
    };

    socket.on("carUpdated", handleCarUpdate);
    socket.on("carAdded", handleCarAdd);

    return () => {
      socket.off("carUpdated", handleCarUpdate);
      socket.off("carAdded", handleCarAdd);
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6">
      {status === "loading" && (
        <p className="text-center text-gray-600">Loading...</p>
      )}
      {status === "failed" && (
        <p className="text-center text-red-600">Error: {error}</p>
      )}
      <CarList cars={cars} />
    </div>
  );
};

export default HomePage;
