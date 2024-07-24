import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars, updateCars, addCar } from "../store/slices/carSlice";
import CarList from "../components/CarList";
import socket from "../utils/websocket";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const cars = useSelector((state: RootState) => state.car.cars);
  const status = useSelector((state: RootState) => state.car.status);
  const error = useSelector((state: RootState) => state.car.error);

  useEffect(() => {
    // Example parameters, replace with actual values or logic as needed
    const page = 1;
    const model = "";
    const year = "";
    const make = "";

    dispatch(fetchCars({ page, model, year, make })).then((action) => {
      if (fetchCars.fulfilled.match(action)) {
        console.log("Fetched cars:", action.payload);
      } else {
        console.error("Failed to fetch cars");
      }
    });

    socket.on("carUpdated", (updatedCars) => {
      dispatch(updateCars(updatedCars));
    });

    socket.on("carAdded", (newCar) => {
      dispatch(addCar(newCar));
    });

    return () => {
      socket.off("carUpdated");
      socket.off("carAdded");
    };
  }, [dispatch]);

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}
      <CarList cars={cars} />
    </div>
  );
};

export default HomePage;
