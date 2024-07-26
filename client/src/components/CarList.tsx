import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchCars,
  setPage,
  setFilters,
  updateCars,
} from "../store/slices/carSlice";
import useSocket from "../hooks/useSocket";
import placeholderImg from "../assets/placeholder.jpg";
import { Button } from "./buttons";
import Pagination from "./filter/Pagination";
import CarFilter from "./filter/CarFilter";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Car } from "../types";

const CarListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, status, error, currentPage, totalPages, filters } = useSelector(
    (state: RootState) => state.car
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [storedFilters, setStoredFilters] = useLocalStorage(
    "carFilters",
    filters
  );

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(storedFilters)) {
      setStoredFilters(filters);
    }
  }, [filters, storedFilters, setStoredFilters]);

  useEffect(() => {
    dispatch(fetchCars({ page: currentPage, ...storedFilters }));
  }, [dispatch, currentPage, storedFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setPage(page));
      dispatch(fetchCars({ page, ...storedFilters }));
    },
    [dispatch, storedFilters]
  );

  const handleEdit = useCallback(
    (carId: string) => {
      navigate(`/car/${carId}`);
    },
    [navigate]
  );

  useSocket("updateCars", (updatedCars: Car[]) => {
    dispatch(updateCars(updatedCars));
  });

  // Debugging state I WILL REMOVE LATER
  useEffect(() => {
    console.log("Current cars in CarListPage:", cars);
  }, [cars]);

  return (
    <div className="pt-16 p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <CarFilter />
        {isAuthenticated && (
          <Link to="/add-car">
            <Button className="mb-4 bg-gray-800 text-white hover:bg-gray-600">
              Add Car
            </Button>
          </Link>
        )}
        {status === "loading" && (
          <p className="text-center text-gray-600">Loading...</p>
        )}
        {status === "failed" && (
          <p className="text-center text-red-600">Error: {error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-white p-4 shadow-lg rounded-lg">
              <div className="relative w-full h-64 md:h-48 lg:h-56 overflow-hidden rounded-lg">
                <img
                  src={car.imageUrl || placeholderImg}
                  alt={car.model}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {car.make} {car.model}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Model:</span>
                  <span className="text-gray-600">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Make:</span>
                  <span className="text-gray-600">{car.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Vin:</span>
                  <span className="text-gray-600">{car.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Year:</span>
                  <span className="text-gray-600">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-gray-600 text-lg font-bold">
                    {car.currency}
                    {car.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Shipping Status:
                  </span>
                  <span className="text-gray-600">{car.shippingStatus}</span>
                </div>
              </div>
              {isAuthenticated && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleEdit(car._id)}
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CarListPage;
