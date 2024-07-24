import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setFilters, fetchCars } from "../store/slices/carSlice";

const CarFilter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.car);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    dispatch(fetchCars({ page: 1 }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700"
          >
            Model
          </label>
          <select
            id="model"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            onBlur={applyFilters}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Models</option>
            {/* Add model options here */}
          </select>
        </div>
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            onBlur={applyFilters}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Years</option>
            {/* Add year options here */}
          </select>
        </div>
        <div>
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700"
          >
            Make
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            onBlur={applyFilters}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Makes</option>
            {/* Add make options here */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
