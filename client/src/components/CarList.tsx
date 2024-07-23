import React from "react";
import { Car } from "../types";

interface CarListProps {
  cars: Car[];
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
  console.log("Cars in CarList:", cars);
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.isArray(cars) && cars.length > 0 ? (
        cars.map((car) => (
          <div
            key={car.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start"
          >
            <h2 className="text-xl font-semibold mb-2">
              {car.make} {car.model}
            </h2>
            <p className="text-gray-700 mb-1">Year: {car.year}</p>
            <p className="text-gray-700 mb-1">
              Price:{car.price} {car.currency}
            </p>
            <p className="text-gray-700 mb-1">Status: {car.status}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No cars available</p>
      )}
    </div>
  );
};

export default CarList;
