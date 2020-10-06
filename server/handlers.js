"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//HELPERS FROM ROUTES.JS
const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

//getSeats function
const getSeats = async (req, res) => {};
//Create and connect to client
const client = await MongoClient(MONGO_URI, options);
await client.connect();
console.log("Connected!");

if (!state) {
  state = {
    bookedSeats: randomlyBookSeats(30),
  };
  console.log(state);
}

try {
  //Access the database
  const db = client.db("exercise_1");

  //Access the seats collections and insert the data
  const seatsColl = await db.collection("seats").find().toArray();

  let seats = {};
  seatsColl.map((seat) => {
    seats[seat._id] = {
      price: seat.price,
      isBooked: seat.isBooked,
    };
  });

  console.log(seats);

  return res.json({
    seats: seats,
    bookedSeats: state.bookedSeats,
    numOfRows: 8,
    seatsPerRow: 12,
  });
} catch (error) {
  console.log(error.stack);
}

client.close();
console.log("disconnected!");

//booking a seat
let lastBookingAttemptSucceeded = false;

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration } = req.body;

  if (!state) {
    state = {
      bookedSeats: randomlyBookSeats(30),
    };
  }

  await delay(Math.random() * 3000);

  const isAlreadyBooked = !!state.bookedSeats[seatId];
  if (isAlreadyBooked) {
    return res.status(400).json({
      message: "This seat has already been booked!",
    });
  }

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    return res.status(500).json({
      message: "An unknown error has occurred. Please try your request again.",
    });
  }

  lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  state.bookedSeats[seatId] = true;

  return res.status(200).json({
    status: 200,
    success: true,
  });
};

module.exports = { getSeats };
