import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { RootState, AppDispatch } from "../store";
import { fetchCars, setPage } from "../store/slices/carSlice";
import placeholderImg from "../assets/placeholder.jpg";
import { Button } from "./index";
import Pagination from "./Pagination";
import CarFilter from "./CarFilter";
import { Link } from "react-router-dom"; // Import Link for navigation

const CarListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
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

  const handleEdit = (carId: string) => {
    console.log(`Edit button clicked for carId: ${carId}`);
    navigate(`/car/${carId}`); // Redirect to car details page
  };

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
                  onClick={() => handleEdit(car._id)} // Pass car._id to handleEdit
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
