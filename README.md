# Car Shipping Management System API

## Endpoints Documentation

## Base URL

http://localhost:5001/api

### User Endpoints

#### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token"
  }
  ```

#### Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Login a user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token"
  }
  ```

### Car Endpoints

#### Get All Cars

- **URL:** `/api/cars`
- **Method:** `GET`
- **Description:** Retrieve a list of all cars.
- **Response:**
  ```json
  [
    {
      "_id": "60c72b2f9b1e8b34d8f1b2d2",
      "make": "Toyota",
      "model": "Corolla",
      "year": 2021,
      "price": 20000
    },
    {
      "_id": "60c72b3f9b1e8b34d8f1b2d3",
      "make": "Honda",
      "model": "Civic",
      "year": 2020,
      "price": 18000
    }
  ]
  ```

#### Get Car by ID

- **URL:** `/api/cars/:id`
- **Method:** `GET`
- **Description:** Retrieve a car by its ID.
- **Response:**
  ```json
  {
    "_id": "60c72b2f9b1e8b34d8f1b2d2",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2021,
    "price": 20000
  }
  ```

#### Add New Car

- **URL:** `/api/cars`
- **Method:** `POST`
- **Description:** Add a new car.
- **Request Body:**
  ```json
  {
    "make": "Ford",
    "model": "Mustang",
    "year": 2022,
    "price": 35000
  }
  ```
- **Response:**
  ```json
  {
    "_id": "60c72b4f9b1e8b34d8f1b2d4",
    "make": "Ford",
    "model": "Mustang",
    "year": 2022,
    "price": 35000
  }
  ```

#### Update Car

- **URL:** `/api/cars/:id`
- **Method:** `PUT`
- **Description:** Update a car's details.
- **Request Body:**
  ```json
  {
    "make": "Ford",
    "model": "Mustang",
    "year": 2023,
    "price": 36000
  }
  ```
- **Response:**
  ```json
  {
    "message": "Car updated successfully"
  }
  ```

#### Delete Car

- **URL:** `/api/cars/:id`
- **Method:** `DELETE`
- **Description:** Delete a car by its ID.
- **Response:**
  ```json
  {
    "message": "Car deleted successfully"
  }
  ```

## Environment Variables

- **File:** `.env`
- **Description:** Defines the environment variables.
- **Variables:**
  ```
  JWT_SECRET=your_jwt_secret
  MONGO_URI=your_mongo_connection_string
  ```

## Installation and Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo-url.git
   ```

2. **Navigate to the project directory:**

   ```sh
   cd your-repo-directory
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Create a `.env` file and add your environment variables:**

   ```sh
   touch .env
   ```

5. **Start the server:**
   ```sh
   npm start
   ```

## Testing the API

- **Use tools like Postman or curl to test the endpoints.**
- **Ensure the server is running at `http://localhost:5001` or your specified port.**
