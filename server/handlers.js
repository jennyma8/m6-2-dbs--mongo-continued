"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//HELPERS FROM ROUTES.JS
// const NUM_OF_ROWS = 8;
// const SEATS_PER_ROW = 12;

// const getRowName = (rowIndex) => {
//   return String.fromCharCode(65 + rowIndex);
// };

// const randomlyBookSeats = (num) => {
//   const bookedSeats = {};

//   while (num > 0) {
//     const row = Math.floor(Math.random() * NUM_OF_ROWS);
//     const seat = Math.floor(Math.random() * SEATS_PER_ROW);

//     const seatId = `${getRowName(row)}-${seat + 1}`;

//     bookedSeats[seatId] = true;

//     num--;
//   }

//   return bookedSeats;
// };

// let state;

//getSeats function
const getSeats = async (req, res) => {
  //Create and connect to client
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("Connected!");

    //   if (!state) {
    //     state = {
    //       bookedSeats: randomlyBookSeats(1),
    //     };
    //     console.log(state);
    //   }

    //Access the database
    const db = client.db("exercise_1");

    //Access the seats collections and insert the data
    const seats = await db.collection("seats").find().toArray();
    const response = {};

    seats.forEach((seat) => {
      response[seat._id] = seat;
    });

    res.status(201).json({
      seats: response,

      numOfRows: 8,
      seatsPerRow: 12,
    });
    client.close();
    console.log("disconnected!");
  } catch (error) {
    res.status(404).json({ status: 404, data: "Not Found" });
  }
};

//booking a seat
// let lastBookingAttemptSucceeded = false;

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration, email, fullName } = req.body;

  //   if (!state) {
  //     state = {
  //       bookedSeats: randomlyBookSeats(1),
  //     };
  //   }

  //   await delay(Math.random() * 3000);

  //   const isAlreadyBooked = !!state.bookedSeats[seatId];
  //   if (isAlreadyBooked) {
  //     return res.status(400).json({
  //       message: "This seat has already been booked!",
  //     });
  //   }

  if (!creditCard || !expiration || !fullName || !email) {
    return res.status(400).json({
      status: 400,
      message: "Please provide all information!",
    });
  }

  //   if (lastBookingAttemptSucceeded) {
  //     lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  //     return res.status(500).json({
  //       message: "An unknown error has occurred. Please try your request again.",
  //     });
  //   }

  //   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  //   state.bookedSeats[seatId] = true;

  //Exercise 4 - handling fullName, email, credit card and expiration
  //   const client = await MongoClient(MONGO_URI, options);
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const query = { _id: seatId };
    // console.log(query);

    //update json object with $set
    const newValues = { $set: { isBooked: true, fullName, email } };

    const db = client.db("exercise_1");

    //Access the "seats" collection and insert the data
    const r = await db.collection("seats").updateOne(query, newValues);
    console.log(r);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: 400,
      success: false,
    });
  }
  client.close();
};

module.exports = { getSeats, bookSeat };
