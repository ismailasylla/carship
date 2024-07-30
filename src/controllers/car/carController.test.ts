import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getCarById,
  getFilterOptions,
} from "./carController";

import dotenv from "dotenv";
import { UpdateResult, DeleteResult } from "mongodb";
import Car from "../../models/carModel";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(express.json());
app.get("/api/cars", getCars);
app.get("/api/filter-options", getFilterOptions);
app.post("/api/cars", createCar);
app.put("/api/cars/:id", updateCar);
app.delete("/api/cars/:id", deleteCar);
app.get("/api/cars/:id", getCarById);

describe("Car Controller", () => {
  beforeAll(async () => {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock Mongoose methods
  beforeEach(() => {
    jest
      .spyOn(Car, "find")
      .mockImplementation(() => Promise.resolve([]) as any);
    jest
      .spyOn(Car, "findById")
      .mockImplementation(() => Promise.resolve(null) as any);
    jest
      .spyOn(Car, "countDocuments")
      .mockImplementation(() => Promise.resolve(0) as any);

    // Mock distinct method with compatible return type
    jest.spyOn(Car, "distinct").mockImplementation((field: string) => {
      const result =
        field === "make"
          ? ["Toyota", "Honda"]
          : field === "model"
          ? ["Corolla", "Civic"]
          : field === "year"
          ? [2020, 2021]
          : [];
      return Promise.resolve(result) as any;
    });

    jest
      .spyOn(Car.prototype, "save")
      .mockImplementation(() => Promise.resolve({} as any));

    // Mocking updateOne with a compatible return type
    jest.spyOn(Car, "updateOne").mockImplementation(() => {
      const result: UpdateResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
        // Include other properties if needed
      };
      return {
        exec: jest.fn().mockResolvedValue(result),
      } as any;
    });

    // Mocking deleteOne with a compatible return type
    jest.spyOn(Car, "deleteOne").mockImplementation(() => {
      const result: DeleteResult = {
        acknowledged: true,
        deletedCount: 1,
        // Include other properties if needed
      };
      return {
        exec: jest.fn().mockResolvedValue(result),
      } as any;
    });
  });

  // Test getCars
  describe("GET /api/cars", () => {
    it("should return a list of cars and total pages", async () => {
      const cars = [
        {
          _id: "1",
          make: "Toyota",
          model: "Corolla",
          year: 2020,
          price: 20000,
        },
      ];
      const totalCars = 1;

      (Car.find as jest.Mock).mockResolvedValue(cars);
      (Car.countDocuments as jest.Mock).mockResolvedValue(totalCars);

      const response = await request(app).get("/api/cars?page=1&limit=10");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        cars,
        totalPages: 1,
      });
    });

    it("should handle errors", async () => {
      (Car.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/cars");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });

  // Test getFilterOptions
  describe("GET /api/filter-options", () => {
    it("should return filter options", async () => {
      const response = await request(app).get("/api/filter-options");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        makes: ["Toyota", "Honda"],
        models: ["Corolla", "Civic"],
        years: [2020, 2021],
      });
    });

    it("should handle errors", async () => {
      (Car.distinct as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/filter-options");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });

  // Test createCar
  describe("POST /api/cars", () => {
    it("should create and return a car", async () => {
      const carData = {
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 20000,
        vin: "12345",
        currency: "USD",
      };
      const savedCar = { ...carData, _id: "1" };

      (Car.prototype.save as jest.Mock).mockResolvedValue(savedCar);
      (Car.find as jest.Mock).mockResolvedValue([savedCar]);

      const response = await request(app).post("/api/cars").send(carData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(savedCar);
    });

    it("should handle validation errors", async () => {
      const carData = {
        make: "",
        model: "Corolla",
        year: 2020,
        price: -20000,
        vin: "12345",
        currency: "USD",
      };

      const response = await request(app).post("/api/cars").send(carData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid price" });
    });

    it("should handle errors", async () => {
      (Car.prototype.save as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const carData = {
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 20000,
        vin: "12345",
        currency: "USD",
      };

      const response = await request(app).post("/api/cars").send(carData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });

  // Test updateCar
  describe("PUT /api/cars/:id", () => {
    it("should update and return the car", async () => {
      const carData = {
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        price: 22000,
        vin: "67890",
        currency: "USD",
      };
      const updatedCar = { ...carData, _id: "1" };

      (Car.findById as jest.Mock).mockResolvedValue(updatedCar);
      (Car.updateOne as jest.Mock).mockResolvedValue({});
      (Car.find as jest.Mock).mockResolvedValue([updatedCar]);

      const response = await request(app).put("/api/cars/1").send(carData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCar);
    });

    it("should handle car not found", async () => {
      (Car.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put("/api/cars/1").send({});

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Car not found" });
    });

    it("should handle errors", async () => {
      (Car.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).put("/api/cars/1").send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });

  // Test deleteCar
  describe("DELETE /api/cars/:id", () => {
    it("should delete the car", async () => {
      (Car.findById as jest.Mock).mockResolvedValue({ _id: "1" });
      (Car.deleteOne as jest.Mock).mockResolvedValue({});
      (Car.find as jest.Mock).mockResolvedValue([]);

      const response = await request(app).delete("/api/cars/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Car deleted" });
    });

    it("should handle car not found", async () => {
      (Car.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/api/cars/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Car not found" });
    });

    it("should handle errors", async () => {
      (Car.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).delete("/api/cars/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });

  // Test getCarById
  describe("GET /api/cars/:id", () => {
    it("should return a car by ID", async () => {
      const car = {
        _id: "1",
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 20000,
      };

      (Car.findById as jest.Mock).mockResolvedValue(car);

      const response = await request(app).get("/api/cars/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(car);
    });

    it("should handle car not found", async () => {
      (Car.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/cars/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Car not found" });
    });

    it("should handle errors", async () => {
      (Car.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/cars/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
        error: "Database error",
      });
    });
  });
});
