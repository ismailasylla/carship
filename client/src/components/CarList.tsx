import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars } from "../store/slices/carSlice";
import { Link, useNavigate } from "react-router-dom";

const CarListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, status, error } = useSelector((state: RootState) => state.car);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCars());
    }
  }, [status, dispatch]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
          &larr; Back
        </button>
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Car List
        </h1>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="bg-white p-4 shadow-lg rounded-lg">
                <img
                  src="https://via.placeholder.com/300x200.png?text=Car+Image"
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h2 className="text-2xl font-semibold mb-2">
                  {car.make} {car.model}
                </h2>
                <p className="mb-2">
                  <strong>Year:</strong> {car.year}
                </p>
                <p className="mb-2">
                  <strong>VIN:</strong> {car.vin}
                </p>
                <p className="mb-2">
                  <strong>Currency:</strong> {car.currency}
                </p>
                <p className="mb-2">
                  <strong>Shipping Status:</strong> {car.shippingStatus}
                </p>
                <Link to={`/car/${car._id}`} className="block mt-4">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarListPage;
