require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Transaction = require("./models/transaction");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
// const PORT = process.env.API_PORT;

app.get("/api/test", (req, res) => {
  res.json("test okay");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { price, name, description, datetime } = req.body;
  const transaction = await Transaction.create({
    price,
    name,
    description,
    datetime,
  });

  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT, () => console.log("Server is running"));
}
// app.listen(PORT, () => console.log("Server is running"));

module.exports = app;