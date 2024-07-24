import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars, setPage } from "../store/slices/carSlice";
import placeholderImg from "../assets/placeholder.jpg";
import { Button } from "./index";
import Pagination from "./Pagination";
import CarFilter from "./CarFilter";

const CarListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, status, error, currentPage, totalPages, filters } = useSelector(
    (state: RootState) => state.car
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCars({ page: currentPage, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchCars({ page, ...filters }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Car List
        </h1>
        <CarFilter />
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={car.imageUrl || placeholderImg}
                alt={car.model}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <h2 className="text-xl font-semibold mb-2">
                {car.make} {car.model}
              </h2>
              <p className="text-sm mb-2">Year: {car.year}</p>
              <p className="text-sm mb-2">Price: ${car.price}</p>
              {isAuthenticated && <Button className="mt-4 w-full">Edit</Button>}
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
