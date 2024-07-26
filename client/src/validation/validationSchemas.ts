import * as Yup from 'yup';

export const carValidationSchema = Yup.object({
  make: Yup.string()
    .trim()
    .min(2, "Make must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Make should only contain letters and spaces")
    .required("Make is required"),
  model: Yup.string()
    .trim()
    .min(2, "Model must be at least 2 characters")
    .matches(/^[a-zA-Z0-9\s]+$/, "Model should only contain letters, numbers, and spaces")
    .required("Model is required"),
  year: Yup.number()
    .integer("Year must be an integer")
    .min(1886, "Year must be between 1886 and the current year")
    .max(new Date().getFullYear(), "Year must be between 1886 and the current year")
    .required("Year is required"),
  price: Yup.number()
    .positive("Price must be a positive number")
    .max(1_000_000, "Price is too high")
    .required("Price is required"),
  vin: Yup.string()
    .length(17, "VIN must be exactly 17 characters long")
    .matches(/^[A-HJ-NPR-Z0-9]+$/, "VIN must exclude I, O, and Q")
    .required("VIN is required"),
});

export const registrationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
