import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  setFilters,
  fetchCars,
  fetchFilterOptions,
} from "../../store/slices/carSlice";

const CarFilter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { filters, filterOptions, status } = useSelector(
    (state: RootState) => state.car
  );

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFilters = { ...filters, [e.target.name]: e.target.value };
      dispatch(setFilters(newFilters));
      dispatch(fetchCars({ page: 1, ...newFilters }));
    },
    [dispatch, filters]
  );

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
            value={filters.model || ""}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Models</option>
            {filterOptions.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
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
            value={filters.make || ""}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Makes</option>
            {filterOptions.makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
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
            value={filters.year || ""}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Years</option>
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {status === "loading" && <p>Loading...</p>}
    </div>
  );
};

export default CarFilter;
