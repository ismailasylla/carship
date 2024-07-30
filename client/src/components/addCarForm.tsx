import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import carSlice from "../store/slices/carSlice";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import socket from "../socket/websocket";
import { AddCarForm } from ".";

// Mock the dispatch function
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

// Mock the `socket.emit` function
jest.mock("../socket/websocket", () => ({
  emit: jest.fn(),
}));

// Mock `react-toastify` methods
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

// Create a mock store
const store = configureStore({
  reducer: {
    car: carSlice,
  },
});

describe("AddCarForm", () => {
  test("renders form fields and submit button", () => {
    render(
      <Provider store={store}>
        <AddCarForm />
      </Provider>
    );

    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shipping status/i)).toBeInTheDocument();
    expect(screen.getByText(/add car/i)).toBeInTheDocument();
  });

  test("displays validation errors", async () => {
    render(
      <Provider store={store}>
        <AddCarForm />
      </Provider>
    );

    userEvent.click(screen.getByText(/add car/i));

    await waitFor(() => {
      expect(screen.getByText(/make is a required field/i)).toBeInTheDocument();
      expect(
        screen.getByText(/model is a required field/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/year is a required field/i)).toBeInTheDocument();
      expect(
        screen.getByText(/price is a required field/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/vin is a required field/i)).toBeInTheDocument();
    });
  });

  test("submits form and handles success", async () => {
    const dispatch = jest.fn();
    const emit = jest.spyOn(socket, "emit");

    render(
      <Provider store={store}>
        <AddCarForm />
      </Provider>
    );

    userEvent.type(screen.getByLabelText(/make/i), "Toyota");
    userEvent.type(screen.getByLabelText(/model/i), "Corolla");
    userEvent.type(screen.getByLabelText(/year/i), "2022");
    userEvent.type(screen.getByLabelText(/price/i), "20000");
    userEvent.type(screen.getByLabelText(/vin/i), "XYZ123");

    userEvent.selectOptions(screen.getByLabelText(/currency/i), "USD");
    userEvent.selectOptions(
      screen.getByLabelText(/shipping status/i),
      "Shipped"
    );

    userEvent.click(screen.getByText(/add car/i));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith("carAdded", {
        _id: "",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        currency: "USD",
        price: 20000,
        shippingStatus: "Shipped",
        vin: "XYZ123",
        createdAt: "",
        updatedAt: "",
        __v: 0,
        imageUrl: "",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Car details added successfully!"
      );
    });
  });

  test("handles error on form submission", async () => {
    const dispatch = jest
      .fn()
      .mockRejectedValue(new Error("Failed to add car"));

    render(
      <Provider store={store}>
        <AddCarForm />
      </Provider>
    );

    userEvent.type(screen.getByLabelText(/make/i), "Toyota");
    userEvent.type(screen.getByLabelText(/model/i), "Corolla");
    userEvent.type(screen.getByLabelText(/year/i), "2022");
    userEvent.type(screen.getByLabelText(/price/i), "20000");
    userEvent.type(screen.getByLabelText(/vin/i), "XYZ123");

    userEvent.selectOptions(screen.getByLabelText(/currency/i), "USD");
    userEvent.selectOptions(
      screen.getByLabelText(/shipping status/i),
      "Shipped"
    );

    userEvent.click(screen.getByText(/add car/i));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add car. Please try again."
      );
    });
  });
});
