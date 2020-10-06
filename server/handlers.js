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
//getSeats function
const getSeats = async (req, res) => {
  //Create and connect to client
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("Connected!");

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
const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration, email, fullName } = req.body;

  if (!creditCard || !expiration || !fullName || !email) {
    return res.status(400).json({
      status: 400,
      message: "Please provide all information!",
    });
  }

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

    res.status(200).json({
      status: 200,
      success: true,
    });
    client.close();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: 400,
      success: false,
    });
  }
};

module.exports = { getSeats, bookSeat };
