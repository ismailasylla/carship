import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars, updateCars, addCar } from "../store/slices/carSlice";
import CarList from "../components/CarList";
import socket from "../socket/websocket";
import { Car } from "../types";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, status, error } = useSelector((state: RootState) => state.car);

  const initialParams = useMemo(
    () => ({
      page: 1,
      model: "",
      year: "",
      make: "",
    }),
    []
  );

  const handleCarUpdate = useCallback(
    (updatedCars: Car[]) => {
      dispatch(updateCars(updatedCars));
    },
    [dispatch]
  );

  const handleCarAdd = useCallback(
    (newCar: Car) => {
      dispatch(addCar(newCar));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchCars(initialParams)).then((action) => {
      if (fetchCars.fulfilled.match(action)) {
        console.log("Fetched cars:", action.payload);
      } else {
        console.error("Failed to fetch cars");
      }
    });

    socket.on("carUpdated", handleCarUpdate);
    socket.on("carAdded", handleCarAdd);

    return () => {
      socket.off("carUpdated", handleCarUpdate);
      socket.off("carAdded", handleCarAdd);
    };
  }, [dispatch, initialParams, handleCarUpdate, handleCarAdd]);

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
