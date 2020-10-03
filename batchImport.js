// var fs = require("file-system");
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
// const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];

for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    // seats[`${row[r]}-${s}`] = {
    //   price: 225,
    //   isBooked: false,

    //add id
    // const id = seats[`${row[r]}-${s}`];

    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}

const seatArray = Object.values(seats);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (req, res) => {
  try {
    console.log(MONGO_URI);
    const client = await MongoClient(MONGO_URI, options);
    console.log(client);
    await client.connect();
    console.log("Connected!");
    const db = client.db("exercise_1");

    //change it to "seats" when console.log all good
    const r = await db.collection("seats").insertMany(seatArray);
    client.close();
    console.log("disconnected!");
    assert.equal(seatArray.length, r.insertedCount);
  } catch (error) {
    console.log(error);
  }
};
// console.log(seats);
// console.log(seatArray);
batchImport();
