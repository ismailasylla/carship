import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import carSlice from "../store/slices/carSlice";
import authSlice from "../store/slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
import CarListPage from "./CarList";

// Mocking necessary hooks and functions
jest.mock("../hooks/useSocket", () => jest.fn());
jest.mock("../hooks/useLocalStorage", () => ({
  useLocalStorage: jest.fn(),
}));

// Setup mock store with correct initial state
const store = configureStore({
  reducer: {
    car: carSlice.reducer,
    auth: authSlice.reducer,
  },
  preloadedState: {
    car: {
      cars: [
        {
          _id: "1",
          make: "Toyota",
          model: "Corolla",
          year: 2020,
          price: 20000,
          vin: "ABC123",
          currency: "$",
          shippingStatus: "In Transit",
          imageUrl: "",
        },
      ],
      status: "idle",
      error: null,
      currentPage: 1,
      totalPages: 1,
      filters: {},
      filterOptions: {
        models: [],
        years: [],
        makes: [],
      },
    },
    auth: {
      isAuthenticated: true,
      user: null,
      loading: false,
      error: null,
      token: null,
    },
  },
});

describe("CarListPage", () => {
  beforeEach(() => {
    (useLocalStorage as jest.Mock).mockReturnValue([
      {},
      jest.fn(), // mock setter
    ]);
  });

  it("should render car list and filter components", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CarListPage />
        </MemoryRouter>
      </Provider>
    );

    // Check if the car details are rendered
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("Model:")).toBeInTheDocument();
    expect(screen.getByText("Make:")).toBeInTheDocument();
    expect(screen.getByText("Vin:")).toBeInTheDocument();
    expect(screen.getByText("Year:")).toBeInTheDocument();
    expect(screen.getByText("Price:")).toBeInTheDocument();
    expect(screen.getByText("Shipping Status:")).toBeInTheDocument();

    // Check if the filter component is rendered
    expect(
      screen.getByRole("button", { name: /Add Car/i })
    ).toBeInTheDocument();
  });

  it("should call handlePageChange when pagination button is clicked", async () => {
    // Mock dispatch function
    const dispatch = jest.fn();
    (store.dispatch as jest.Mock) = dispatch;

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CarListPage />
        </MemoryRouter>
      </Provider>
    );

    // Simulate page change
    fireEvent.click(screen.getByRole("button", { name: /Page 2/i }));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(setPage(2));
      expect(dispatch).toHaveBeenCalledWith(
        fetchCars({ page: 2, model: "", year: "", make: "" })
      );
    });
  });

  it("should navigate to car edit page when Edit button is clicked", () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CarListPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(navigate).toHaveBeenCalledWith("/car/1");
  });

  it("should display loading state", () => {
    store.getState().car.status = "loading";

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CarListPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display error message if status is failed", () => {
    store.getState().car.status = "failed";
    store.getState().car.error = "An error occurred";

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CarListPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Error: An error occurred")).toBeInTheDocument();
  });
});
